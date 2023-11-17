import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

import { Status, status } from '@/utils/constants';
import { School } from '@/schemas/school/school';
import { EducationLevel } from '@/schemas/educationLevel/educationLevel';

export type SchoolYearDocument = HydratedDocument<SchoolYear>;

@Schema({ timestamps: true })
export class SchoolYear {
  @Prop({
    required: true,
  })
  year: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'School', required: true })
  school: School;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'EducationLevel', required: true })
  educationLevel: EducationLevel;

  @Prop({ enum: status, default: 'active' })
  status: Status;
}

export const SchoolYearSchema = SchemaFactory.createForClass(SchoolYear);
