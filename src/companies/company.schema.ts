import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditedModel } from 'src/common/schema/audit.schema';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
class Item extends AuditedModel {
  @Prop({ unique: true })
  name: string;

  @Prop([String])
  imageUrls: string[];
}

@Schema()
class Site extends AuditedModel {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  address: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  siteManagerIds: string[];
}

@Schema()
class Supplier extends AuditedModel {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop([String])
  mobiles: string[];

  @Prop([String])
  accountNumber: string[];

  @Prop({ default: {} })
  items: Record<string, { rate: number }>;
}

class CompanyConfig {
  @Prop([String])
  mustApproveItemIds?: string[];

  @Prop()
  approvalThreshold?: number;
}

const itemSchema = SchemaFactory.createForClass(Item);
const siteSchema = SchemaFactory.createForClass(Site);
const supplierSchema = SchemaFactory.createForClass(Supplier);

@Schema({ collection: 'companies' })
export class Company extends AuditedModel {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: [itemSchema] })
  items: Item[];

  @Prop({ type: [siteSchema] })
  sites: Site[];

  @Prop({ type: [supplierSchema] })
  suppliers: Supplier[];

  @Prop({ default: {} })
  config: CompanyConfig;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
