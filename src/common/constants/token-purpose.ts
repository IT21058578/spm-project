export const TokenPurpose = {
    SIGN_UP: "SIGN_UP",
    RESET_PASSWORD: "RESET_PASSWORD",
} as const

export type TokenPurpose = keyof typeof TokenPurpose; 