import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Status, status } from '@/utils/constants';

export type SchoolDocument = HydratedDocument<School>;

@Schema({ timestamps: true })
export class School {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({ required: true })
  regNo: string;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ enum: status, default: 'inactive' })
  status: Status;

  @Prop({ required: false })
  phone?: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

// SchoolSchema.pre('save', async function (next) {
//   const school = this as School;
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(school.password, salt);

//   school.password = hash;
//   next();
// });
