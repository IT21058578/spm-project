import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/common/constants/user-roles';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  region: string;

  @Prop()
  country: string;

  @Prop()
  password: string;

  @Prop([String])
  roles: UserRole[];

  @Prop()
  isAuthorized: boolean;

  @Prop()
  companyId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
