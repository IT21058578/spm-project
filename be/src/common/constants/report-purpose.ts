export const ReportPurpose = {
  PRODUCT: {
    name: 'Sera - Products Report',
    template: 'products-report',
  },
  USER: {
    name: 'Sera - Users Report',
    template: 'users-report',
  },
  ORDER: {
    name: 'Sera - Orders Report',
    template: 'orders-report',
  },
} as const;
export type ReportPurpose = keyof typeof ReportPurpose;
