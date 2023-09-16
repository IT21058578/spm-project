import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';

@Module({
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
