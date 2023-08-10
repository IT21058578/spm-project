export const TokenStatus = {
  CLAIMED: 'CLAIMED',
  REVOKED: 'REVOKED',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
} as const;

export type TokenStatus = keyof typeof TokenStatus;
