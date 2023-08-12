import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenDocument } from './token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { TokenPurpose } from 'src/common/constants/token-purpose';
import { TokenStatus } from 'src/common/constants/token-status';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async createSignUpToken(email: string): Promise<TokenDocument> {
    return await this.createTokenOfPurpose(email, TokenPurpose.SIGN_UP);
  }

  async createResetPasswordToken(email: string): Promise<TokenDocument> {
    return await this.createTokenOfPurpose(email, TokenPurpose.RESET_PASSWORD);
  }

  async revokeAllActiveSignUpTokens(email: string) {
    await this.revokeAllTokensOfPurpose(email, TokenPurpose.SIGN_UP);
  }

  async revokeAllActiveResetPasswordTokens(email: string) {
    await this.revokeAllTokensOfPurpose(email, TokenPurpose.RESET_PASSWORD);
  }

  private async revokeAllTokensOfPurpose(
    email: string,
    tokenPurpose: TokenPurpose,
  ) {
    this.logger.log(
      `Revoking all ${tokenPurpose} tokens for user with email '${email}'`,
    );
    const revokedTokens = await this.tokenModel.find({
      email,
      tokenPurpose,
      tokenStatus: TokenStatus.ACTIVE,
    });
    await Promise.all(
      revokedTokens.map(async (token) => {
        token.tokenStatus = TokenStatus.REVOKED;
        await token.save();
      }),
    );
    this.logger.log(
      `Succesfully revoked all ${tokenPurpose} tokens for user with email '${email}'`,
    );
  }

  private async createTokenOfPurpose(email: string, purpose: TokenPurpose) {
    this.logger.log(`Creating '${purpose}' token for user with email ${email}`);
    const createdToken = new this.tokenModel({
      email,
      purpose,
      code: uuid(),
      tokenStatus: TokenStatus.ACTIVE,
    });
    this.logger.log(`Created '${purpose}' token for user with email ${email}`);
    return await createdToken.save();
  }
}
