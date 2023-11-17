import { Calender } from '@/schemas/calender/calender';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCalenderEventDTO, UpdateCalenderEventDTO } from './dto/calender.dto';
import { queryBuilder } from '@/utils/queryHelper';
import { paginationBuilder } from '@/utils/paginationBuilder';
import { strToObjectId } from '@/utils/strToObjectId';

@Injectable()
export class CalenderService {
    constructor(@InjectModel(Calender.name) private eventCalender: Model<Calender>) {


    }
    async create(data: CreateCalenderEventDTO) {
        const newCalenderEvent = new this.eventCalender(data);
        return await newCalenderEvent.save()

    }

    async findAll(query): Promise<{
        data: object;
        meta: {
            limit: number;
            page: number;
            total: number;
            totalPages: number;
        }
    }> {
        //return this.academicClassModel.find();
        const { page, pageSize } = query;
        const pipeline = queryBuilder(page, pageSize, 'calender', []);
        const [{ calender, total }] = await this.eventCalender.aggregate(pipeline);

        return paginationBuilder(calender, total, page, pageSize);
    }
    async findBySchool(query): Promise<{
        data: object;
        meta: {
            limit: number;
            page: number;
            total: number;
            totalPages: number;
        }
    }> {
        //return this.academicClassModel.find();{ author : "dave" } 

        const { page, pageSize, school } = query;

        const pipeline = queryBuilder(page, pageSize, 'calendar', [], { school: strToObjectId(school) });
        const [{ calendar, total }] = await this.eventCalender.aggregate(pipeline);

        return paginationBuilder(calendar, total, page, pageSize);
    }
    async findById(calenderId: string): Promise<Calender> {
        if (!Types.ObjectId.isValid(calenderId)) {
            return null;
        }

        const calender = await this.eventCalender.findById(calenderId);
        if (!calender) {
            return null;
        }

        return calender;
    }

    async update(calenderId: string, updateCalenderDto: UpdateCalenderEventDTO): Promise<Calender> {
        if (!Types.ObjectId.isValid(calenderId)) {
            return null;
        }

        return await this.eventCalender.findByIdAndUpdate(calenderId, updateCalenderDto);

    }

    async delete(calenderId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(calenderId)) {
            return false;
        }
        const isFound = await this.findById(calenderId);
        if (!isFound) return null
        await this.eventCalender.findByIdAndDelete(calenderId);

        return true;
    }
}
