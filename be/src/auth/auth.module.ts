import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/token/token.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    TokenModule,
    MailerModule,
    JwtTokenModule,
    EmailModule,
  ],
})
export class AuthModule {}
