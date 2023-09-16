import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { KeyLike, SignJWT, importPKCS8, importSPKI, jwtVerify } from 'jose';
import { join } from 'path';

@Injectable()
export class JwtTokenService {
  private accessPublicKey: KeyLike;
  private accessPrivateKey: KeyLike;
  private refreshPublicKey: KeyLike;
  private refreshPrivateKey: KeyLike;
  private readonly keyAlgorithm = 'RS256';
  private readonly issuer = 'SERA';
  private readonly logger = new Logger(JwtTokenService.name);

  constructor() {
    this.setup();
  }

  private async setup() {
    this.logger.log('Setting up private and public keys...');
    const [
      accessPrivateKey,
      accessPublicKey,
      refreshPrivateKey,
      refreshPublicKey,
    ] = await Promise.all([
      this.loadKey('./assets/certs/access-private-key.pem', true),
      this.loadKey('./assets/certs/access-public-key.pem'),
      this.loadKey('./assets/certs/refresh-private-key.pem', true),
      this.loadKey('./assets/certs/refresh-public-key.pem'),
    ]);
    this.accessPrivateKey = accessPrivateKey;
    this.accessPublicKey = accessPublicKey;
    this.refreshPrivateKey = refreshPrivateKey;
    this.refreshPublicKey = refreshPublicKey;
    this.logger.log('Finished setting up private and public keys');
  }

  async getAccessToken(id: string): Promise<string> {
    this.logger.log(`Creating new access token for user with id '${id}'`);
    return new SignJWT({})
      .setIssuedAt()
      .setSubject(id)
      .setIssuer(this.issuer)
      .setExpirationTime('2h')
      .setProtectedHeader({ alg: this.keyAlgorithm })
      .sign(this.accessPrivateKey);
  }

  async getRefreshToken(id: string): Promise<string> {
    this.logger.log(`Creating new refresh token for user with id '${id}'`);
    return new SignJWT({})
      .setIssuedAt()
      .setSubject(id)
      .setIssuer(this.issuer)
      .setExpirationTime('7d')
      .setProtectedHeader({ alg: this.keyAlgorithm })
      .sign(this.refreshPrivateKey);
  }

  async verifyAccessToken(token: string): Promise<string> {
    this.logger.log(`Verifying access token '${token}'...`);
    const { payload } = await jwtVerify(token, this.accessPublicKey, {
      issuer: this.issuer,
      requiredClaims: ['sub'],
      algorithms: [this.keyAlgorithm],
    });
    return payload.sub!;
  }

  async verifyRefreshToken(token: string): Promise<string> {
    this.logger.log(`Verifying refresh token '${token}'...`);
    const { payload } = await jwtVerify(token, this.refreshPublicKey, {
      issuer: this.issuer,
      requiredClaims: ['sub'],
      algorithms: [this.keyAlgorithm],
    });
    return payload.sub!;
  }

  private async loadKey(path: string, isPrivate?: boolean) {
    const keyStr = (await readFile(join(process.cwd(), path))).toString();
    if (isPrivate) {
      return await importPKCS8(keyStr, this.keyAlgorithm);
    }
    return await importSPKI(keyStr, this.keyAlgorithm);
  }
}
