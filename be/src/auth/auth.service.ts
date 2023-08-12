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
import { MailerService } from '@nestjs-modules/mailer';
import { TokenService } from 'src/token/token.service';
import { Token } from 'src/token/token.schema';
import { TokenPurpose } from 'src/common/constants/token-purpose';
import { TokenStatus } from 'src/common/constants/token-status';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
    private readonly jwtTokenService: JwtTokenService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
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
          `User with id '${existingUser.id}' has tried to login but used wrong password`,
        );
        throw Error();
      }

      // TODO: Change back to !existingUser.isAuthorized
      if (false) {
        this.logger.warn(
          `User with id ${existingUser.id} attempted login but has not verified their email`,
        );
        throw Error();
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtTokenService.getAccessToken(existingUser.id),
        this.jwtTokenService.getRefreshToken(existingUser.id),
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

    this.mailerService
      .sendMail({
        to: email,
        from: 'noreply@sera.com',
        subject: 'Sera - Complete your registration',
        text: `Your registration code is ${token.code}`,
        template: 'registration',
      })
      .then(() => {
        this.logger.log(
          `Successfully sent registration email to user with email ${email}`,
        );
      })
      .catch((err) => {
        this.logger.warn(
          `Could not send registration email to user with email '${email}'`,
        );
        console.log(err);
      });
  }

  async authorizeUser(tokenCode: string) {
    const token = await this.tokenModel.findOne({
      code: tokenCode,
      purpose: TokenPurpose.SIGN_UP,
    });

    if (token === null) {
      this.logger.warn(`Could not find token with code '${tokenCode}'`);
      throw new BadRequestException(ErrorMessage.TOKEN_NOT_FOUND);
    }

    const existingUser = await this.userModel.findOne({ email: token.email });
    if (existingUser == null) {
      this.logger.warn(`Could not find user with email '${token.email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);
    }

    existingUser.isAuthorized = true;
    token.tokenStatus = TokenStatus.REVOKED;

    await Promise.all([token.save(), existingUser.save()]);
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

    this.mailerService
      .sendMail({
        to: email,
        from: 'noreply@sera.com',
        subject: 'Sera - Reset your password',
        text: `Your password reset code is ${token.code}`,
      })
      .catch(() => {
        this.logger.warn(
          `Could not send forgot user email to user with email '${email}'`,
        );
      });
  }

  async resetUserPassword(password: string, tokenCode: string) {
    const token = await this.tokenModel.findOne({
      code: tokenCode,
      purpose: TokenPurpose.RESET_PASSWORD,
    });
    if (token === null) {
      throw new BadRequestException(ErrorMessage.TOKEN_NOT_FOUND);
    }

    const existingUser = await this.userModel.findOne({ email: token.email });
    if (existingUser === null) {
      return;
    }

    existingUser.password = await hash(password, 10);
    token.tokenStatus = TokenStatus.REVOKED;

    await Promise.all([token.save(), existingUser.save()]);
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
