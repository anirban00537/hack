import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

import { Status, status } from '@/utils/constants';
import { School } from '@/schemas/school/school';

export type EducationLevelDocument = HydratedDocument<EducationLevel>;

@Schema({ timestamps: true })
export class EducationLevel {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'School' })
  school: School;

  @Prop({ enum: status, default: 'active' })
  status: Status;
}

export const EducationLevelSchema = SchemaFactory.createForClass(EducationLevel);
