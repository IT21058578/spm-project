export const EmailPurpose = {
  SIGN_UP: {
    subject: 'Sera - Complete your registration',
    template: 'registration',
  },
  RESET_PASSWORD: {
    subject: 'Sera - Reset your password',
    template: 'reset-password',
  },
} as const;
export type EmailPurpose = keyof typeof EmailPurpose;
