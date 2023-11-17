import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

import { School } from '@/schemas/school/school';
import { Subject } from '@/schemas/subject/subject';
import { SchoolYear } from '@/schemas/schoolYear/schoolYear';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({ required: true })
  regNo: string;

  @Prop({ required: true })
  nameOfGuardian: string;

  @Prop({ required: true })
  phoneOfGuardian: string;

  @Prop()
  emailOfGuardian?: string;

  @Prop()
  profilePic?: string;

  @Prop({ required: true })
  dateOfBirth?: string;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'School', required: true })
  school: School;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: 'Subject' }] })
  subjects: Subject[];

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'SchoolYear' })
  schoolYear: SchoolYear;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
