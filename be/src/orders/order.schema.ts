import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DeliveryStatus } from 'src/common/constants/delivery-status';
import { AuditedModel } from 'src/common/schema/audit.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: 'orders' })
export class Order extends AuditedModel {
  @Prop()
  userId: string;

  @Prop({ type: Map, of: Map })
  items: {
      [productId: string]: {
      
      price: number;
      qty: number;
    };
  };

  @Prop()
  totalPrice: number;

  @Prop(String)
  deliveryStatus: DeliveryStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
