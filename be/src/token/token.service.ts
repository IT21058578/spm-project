import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Token, TokenDocument } from './token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { TokenPurpose } from 'src/common/constants/token-purpose';
import { TokenStatus } from 'src/common/constants/token-status';
import ErrorMessage from 'src/common/constants/error-message';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {}

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

  async claimToken(code: string, tokenPurpose: TokenPurpose) {
    this.logger.log(
      `Attempting to claim '${tokenPurpose}' token with code '${code}'`,
    );

    const token = await this.tokenModel.findOne({
      code,
      purpose: tokenPurpose,
    });

    if (token === null) {
      this.logger.warn(
        `Could not find '${tokenPurpose}' token with code '${code}'`,
      );
      throw new BadRequestException(ErrorMessage.TOKEN_NOT_FOUND);
    }

    token.tokenStatus = TokenStatus.CLAIMED;
    const savedToken = await token.save();
    return savedToken.toJSON();
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
