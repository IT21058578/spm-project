import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { UsersService } from 'src/users/users.service';
import ErrorMessage from '../constants/error-message';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('Attempting to authenticate user...');
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);
    if (!token) {
      this.logger.debug(`Could not authenticate user`);
      return true;
    }
    try {
      const id = await this.jwtTokenService.verifyAccessToken(token);
      const { password, ...user } = await this.usersService.getUser(id);
      this.logger.debug(`Authenticated user with id '${id}'`);
      request['user'] = user;
      return true;
    } catch (error) {
      console.log(error);
      this.logger.debug(`Could not authenticate user`);
    }
    this.logger.warn(
      `User attempted to access resources with an invalid token`,
    );
    throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
  }

  private getToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
