import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AcademicClass } from "@/schemas/academicClass/academicClass";
import { CreateAcademicClassDTO, UpdateAcademicClassDTO } from './dto/academic-class.dto';
import { queryBuilder } from '@/utils/queryHelper';
import { paginationBuilder } from '@/utils/paginationBuilder';
import { strToObjectId } from '@/utils/strToObjectId';




@Injectable()
export class AcademicClassService {
    constructor(
        @InjectModel(AcademicClass.name)
        private academicClassModel: Model<AcademicClass>,
        // private readonly userService: UserService,
    ) { }

    async create(createAcademicClassDto: CreateAcademicClassDTO): Promise<AcademicClass> {
        const academicClass = new this.academicClassModel(createAcademicClassDto);

        return await academicClass.save();
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
        const pipeline = queryBuilder(page, pageSize, 'academicClass', []);
        const [{ academicClass, total }] = await this.academicClassModel.aggregate(pipeline);

        return paginationBuilder(academicClass, total, page, pageSize);
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
        if (!Types.ObjectId.isValid(school)) {
            return null;
        }
        const pipeline = queryBuilder(page, pageSize, 'academicClass', [], {
            school: strToObjectId(school)

        });

        const [{ academicClass, total }] = await this.academicClassModel.aggregate(pipeline);
        console.log({ school })
        return paginationBuilder(academicClass, total, page, pageSize);
    }


    async findById(academicClassId: string): Promise<AcademicClass> {
        if (!Types.ObjectId.isValid(academicClassId)) {
            return null;
        }

        const academicClass = await this.academicClassModel.findById(academicClassId);
        if (!academicClass) {
            return null;
        }

        return academicClass;
    }

    async update(academicClassId: string, updateAcademicClassDto: UpdateAcademicClassDTO): Promise<AcademicClass> {
        if (!Types.ObjectId.isValid(academicClassId)) {
            return null;
        }

        const academicClass = await this.academicClassModel.findByIdAndUpdate(academicClassId, updateAcademicClassDto);




        return academicClass;
    }

    async delete(academicClassId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(academicClassId)) {
            return false;
        }
        const isFound = await this.findById(academicClassId);
        if (!isFound) return null
        const academicClass = await this.academicClassModel.findByIdAndDelete(academicClassId);

        return true;
    }
}
