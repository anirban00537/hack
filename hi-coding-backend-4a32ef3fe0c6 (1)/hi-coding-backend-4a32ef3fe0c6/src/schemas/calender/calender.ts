import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";
import { School } from "../school/school";

export type CalenderDocument = HydratedDocument<Calender>

@Schema({ timestamps: true })
export class Calender {

    // @Prop()
    // _id?: string

    @Prop({ required: true })
    eventStart: string;

    @Prop({ required: true })
    eventEnd: string;

    @Prop({ required: true })
    eventTitle: string;

    @Prop({ required: true })
    eventId: string;

    @Prop({ type: MongoSchema.Types.ObjectId, ref: 'School' })
    school: School;

    @Prop()
    eventType?: string;
}
export const CalenderSchema = SchemaFactory.createForClass(Calender)