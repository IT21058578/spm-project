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

@Module({
  imports: [
    UsersModule,
    OrdersModule,
    AuthModule,
    ReviewModule,
    ProductsModule,
    TokenModule,
    JwtTokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: 'smtps://user@domain.com:pass@smtp.domain.com',
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
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
