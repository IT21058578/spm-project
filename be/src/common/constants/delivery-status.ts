export const DeliveryStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type DeliveryStatus = keyof typeof DeliveryStatus;
