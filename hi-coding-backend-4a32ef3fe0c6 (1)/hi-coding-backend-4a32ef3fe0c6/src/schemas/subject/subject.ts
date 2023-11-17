import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

import { Status, status } from '@/utils/constants';
import { SchoolYear } from '@/schemas/schoolYear/schoolYear';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'SchoolYear', required: true })
  schoolYear: SchoolYear;

  @Prop({ enum: status, default: 'active' })
  status: Status;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
