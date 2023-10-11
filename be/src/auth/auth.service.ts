import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, compare } from 'bcrypt';
import ErrorMessage from 'src/common/constants/error-message';
import { LoginDto } from 'src/common/dtos/login.dto';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Model } from 'mongoose';
import { UserRole } from 'src/common/constants/user-roles';
import { TokenService } from 'src/token/token.service';
import { TokenPurpose } from 'src/common/constants/token-purpose';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly jwtTokenService: JwtTokenService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async loginUser(email: string, password: string): Promise<LoginDto> {
    try {
      const existingUser = await this.usersService.getUserByEmail(email);
      const isPasswordsMatching = await compare(
        password,
        existingUser.password,
      );

      if (!isPasswordsMatching) {
        this.logger.warn(
          `User with id '${existingUser._id}' has tried to login but used wrong password`,
        );
        throw Error();
      }

      // TODO: Change back to !existingUser.isAuthorized
      if (false) {
        this.logger.warn(
          `User with id ${existingUser._id} attempted login but has not verified their email`,
        );
        throw Error();
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtTokenService.getAccessToken(existingUser._id as any),
        this.jwtTokenService.getRefreshToken(existingUser._id as any),
      ]);

      const { password: userPassword, ...sanitizedUser } = existingUser;
      return { tokens: { accessToken, refreshToken }, user: sanitizedUser };
    } catch (error) {
      this.logger.warn(`Failed to login user with email '${email}'`);
      console.log(error);
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }

  async registerUser(userDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: userDto.email });
    if (existingUser !== null) {
      this.logger.warn(
        `Attempted register but user with email '${userDto.email}' already exists`,
      );
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }
    const createdUser = new this.userModel(userDto);
    createdUser.roles = [UserRole.USER];
    createdUser.password = await hash(createdUser.password, 10);
    createdUser.isAuthorized = false;
    const savedUser = await createdUser.save();
    this.sendRegistrationMail(userDto.email);
    return savedUser;
  }

  async sendRegistrationMail(email: string) {
    await this.tokenService.revokeAllActiveSignUpTokens(email);
    const token = await this.tokenService.createSignUpToken(email);
    this.emailService.sendMail(email, TokenPurpose.SIGN_UP, {
      token: token.code,
    });
  }

  async authorizeUser(tokenCode: string) {
    const { email } = await this.tokenService.claimToken(
      tokenCode,
      TokenPurpose.SIGN_UP,
    );
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser == null) {
      this.logger.warn(`Could not find user with email '${email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);
    }

    existingUser.isAuthorized = true;
    const savedUser = await existingUser.save();
    return savedUser.toJSON();
  }

  async forgotUserPassword(email: string) {
    this.logger.log(
      `Attempting to send forgot password email to user with email '${email}'`,
    );
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser === null) {
      this.logger.log(`Could not find a user with email '${email}'`);
      return;
    }

    await this.tokenService.revokeAllActiveResetPasswordTokens(email);
    const token = await this.tokenService.createResetPasswordToken(email);
    this.emailService.sendMail(email, TokenPurpose.RESET_PASSWORD, {
      token: token.code,
    });
  }

  async resetUserPassword(password: string, tokenCode: string) {
    const { email } = await this.tokenService.claimToken(
      tokenCode,
      TokenPurpose.SIGN_UP,
    );
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser === null) {
      this.logger.warn(`Could not find user with email '${email}'`);
      return;
    }

    existingUser.password = await hash(password, 10);
    const savedUser = await existingUser.save();
    return savedUser.toJSON();
  }

  async changeUserPassword(
    email: string,
    password: string,
    oldPassword: string,
  ) {
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser === null) {
        return;
      }

      const isPasswordsMatching = await compare(
        oldPassword,
        existingUser.password,
      );

      if (!isPasswordsMatching) {
        throw Error();
      }

      existingUser.password = await hash(password, 10);

      await existingUser.save();
    } catch (error) {
      throw new BadRequestException(ErrorMessage.INVALID_CREDENTIALS);
    }
  }
}
