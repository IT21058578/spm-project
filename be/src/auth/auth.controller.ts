import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { LoginRequestDto } from 'src/common/dtos/login-request.dto';
import { LoginDto } from 'src/common/dtos/login.dto';
import { AuthService } from './auth.service';
import { AuthorizeRequestDto } from 'src/common/dtos/authorize-request.dto';
import { ResetPasswordRequestDto } from 'src/common/dtos/reset-password-request.dto';
import { ChangePasswordRequestDto } from 'src/common/dtos/change-password-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/user-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Body() { email, password }: LoginRequestDto,
  ): Promise<LoginDto> {
    return await this.authService.loginUser(email, password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() userDto: CreateUserDto) {
    await this.authService.registerUser(userDto);
  }

  @Post('register/resend')
  async resendRegistrationMail(@Query() email: string) {
    await this.authService.sendRegistrationMail(email);
  }

  @Put('authorize')
  async authorizeUser(@Body() { email, tokenCode }: AuthorizeRequestDto) {
    await this.authService.authorizeUser(email, tokenCode);
  }

  @Put('password/forgot')
  async forgotUserPassword(@Query() email: string) {
    await this.authService.forgotUserPassword(email);
  }

  @Put('password/reset')
  async resetUserPassword(
    @Body() { email, password, tokenCode }: ResetPasswordRequestDto,
  ) {
    await this.authService.resetUserPassword(email, password, tokenCode);
  }

  @Put('password/change')
  @Roles(UserRole.USER)
  async changeUserPassword(
    @Body() { email, password, oldPassword }: ChangePasswordRequestDto,
  ) {
    await this.authService.changeUserPassword(email, password, oldPassword);
  }
}
