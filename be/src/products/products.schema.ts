import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditedModel } from 'src/common/schema/audit.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'products' })
export class Product extends AuditedModel {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  price: number;

  @Prop()
  type: string;

  @Prop()
  color: string;

  @Prop()
  images: string[];

  @Prop()
  tags: string[];

  @Prop()
  countInStock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
