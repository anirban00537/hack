import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserRole } from '@/schemas/userRole/userRole';
import { School } from '@/schemas/school/school';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: 'UserRole', required: true }] })
  roles: UserRole[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: 'School' }] })
  school: School[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as User;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
  next();
});
