import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { userRoles } from '@/utils/constants';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema({ timestamps: true })
export class UserRole {
  @Prop({
    required: true,
    unique: true,
    enum: userRoles,
  })
  name: string;

  @Prop({ required: true, unique: true })
  label: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
