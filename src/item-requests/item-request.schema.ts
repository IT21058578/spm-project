import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditedModel } from 'src/common/schema/audit.schema';

export type ItemRequestDocument = HydratedDocument<ItemRequest>;

export const ItemRequestStatus = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  PARTIALLY_APPROVED: 'PARTIALLY_APPROVED',
  APPROVED: 'APPROVED',
  PARTIALLY_DELIVERED: 'PARTIALLY_DELIVERED',
  DELIVERED: 'DELIVERED',
  PENDING_INVOICE: 'PENDING_INVOICE',
  COMPLETED: 'COMPLETED',
} as const;

export type ItemRequestStatus = keyof typeof ItemRequestStatus;

class Approval extends AuditedModel {
  @Prop()
  isApproved: boolean;

  @Prop()
  refferredTo?: string;

  @Prop()
  description?: string;
}

class Delivery extends AuditedModel {
  @Prop()
  qty: number;
}

class Invoice extends AuditedModel {
  @Prop()
  invoiceUrls: string[];
}

const approvalSchema = SchemaFactory.createForClass(Approval);
const deliverySchema = SchemaFactory.createForClass(Delivery);
const invoiceSchema = SchemaFactory.createForClass(Invoice);

@Schema({ collection: 'item-requests' })
export class ItemRequest extends AuditedModel {
  @Prop()
  companyId: string;

  @Prop()
  supplierId: string;

  @Prop()
  itemId: string;

  @Prop()
  siteId: string;

  @Prop()
  qty: number;

  @Prop()
  status: ItemRequestStatus;

  // Applied on subsequent steps
  @Prop(invoiceSchema)
  invoice: Invoice;

  @Prop([approvalSchema])
  approvals: Approval[];

  @Prop([deliverySchema])
  deliveries: Delivery[];
}

export const ItemRequestSchema = SchemaFactory.createForClass(ItemRequest);
