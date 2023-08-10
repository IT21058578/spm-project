import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AuditedModel } from "src/common/schema/audit.schema";

export type ReviewDocument = HydratedDocument<Review>;

@Schema({collection: "reviews"})
export class Review extends AuditedModel {
    @Prop()
    rating: number;

    @Prop()
    description: string;

    @Prop()
    productId: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);