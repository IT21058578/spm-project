import { readFile } from 'fs/promises';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { UsersModule } from './users/users.module';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { ReviewModule } from './reviews/review.module';
import { ReviewService } from './reviews/review.service';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { JwtTokenService } from './jwt-token/jwt-token.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth-guard.guard';
import { RolesGuard } from './common/guards/roles-guard.guard';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { DataGenModule } from './data-gen/data-gen.module';
import { DataGenService } from './data-gen/data-gen.service';
import { FileModule } from './file/file.module';

import { ConfigKey } from './common/constants/config-key';

@Module({
  imports: [
    UsersModule,
    OrdersModule,
    AuthModule,
    ReviewModule,
    ProductsModule,
    TokenModule,
    JwtTokenModule,
    EmailModule,
    DataGenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        authDomain: configService.get(ConfigKey.FIREBASE_AUTH_DOMAIN),
        storageBucket: configService.get(ConfigKey.FIREBASE_BUCKET_NAME),
        projectId: configService.get(ConfigKey.FIREBASE_PROJECT_ID),
        appId: configService.get(ConfigKey.FIREBASE_APP_ID),
        apiKey: await readFile(
          join(process.cwd(), './assets/certs/firebase-private-key.pem'),
          { encoding: 'utf-8' },
        ),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(ConfigKey.MONGO_URI),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get(ConfigKey.SMTP_HOST),
          port: 465,
          secure: true,
          auth: {
            user: configService.get(ConfigKey.SMTP_USER),
            pass: configService.get(ConfigKey.SMTP_PASS),
          },
          connectionTimeout: 1 * 60 * 1000,
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + './../assets/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    OrdersService,
    ProductsService,
    AuthService,
    UsersService,
    TokenService,
    ReviewService,
    JwtTokenService,
    EmailService,
    DataGenService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
