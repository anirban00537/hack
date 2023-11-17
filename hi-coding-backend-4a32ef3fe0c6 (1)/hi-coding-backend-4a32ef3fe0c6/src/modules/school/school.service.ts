import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { CreateSchoolDTO, UpdateSchoolDTO } from '@/modules/school/dto/school.dto';
import { School } from '@/schemas/school/school';
import { Model, isValidObjectId } from 'mongoose';
import { generatePassword } from '@/utils/generatePassword';
import { Query, paginationBuilder } from '@/utils/paginationBuilder';
import { queryBuilder } from '@/utils/queryHelper';
import { Status, UserRole, status } from '@/utils/constants';
import { EmailService } from '@/services/email/email.service';
import { UserService } from '@/modules/user/user.service';
import { MongoTransaction, IMongoTransaction } from '@/decorators/mongoTransaction';
import { loggers } from 'winston';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<School>,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) { }

  public async createSchool(body: CreateSchoolDTO) {
    const school = new this.schoolModel({ ...body, password: '' });
    await school.save();
    return { success: true };
  }

  public async getAll(query: Query) {
    const { page, pageSize } = query;
    const pipeline = queryBuilder(page, pageSize, 'schools', ['password']);
    const [{ schools, total }] = await this.schoolModel.aggregate(pipeline);

    return paginationBuilder(schools, total, page, pageSize);
  }

  public async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid id');
    }

    return await this.schoolModel.findById(id);
  }

  @MongoTransaction()
  public async update(id: string, body: UpdateSchoolDTO, options?: IMongoTransaction) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid id');
    }

    const school = await this.findById(id);

    if (!school) {
      throw new BadRequestException('invalid id');
    }
    let password = school.password;

    if (body.status === Status.approved && school.status === Status.inactive) {
      password = generatePassword();
      const { sendEmail } = await this.userService.addUserToSchoolOrCreateUser(
        {
          email: school.email,
          password,
          roles: [UserRole.schoolManager],
          username: school.name,
          school: [school._id.toString()],
        },
        options,
      );

      if (sendEmail) {
        await this.emailService.sendEmail(
          school.email,
          'BlackBoard Password',
          `<div>Please use this password for login. ${password}</div>`,
        );
      }
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    await this.schoolModel.findByIdAndUpdate(id, { ...body, password }, options);
    return {
      success: true,
    };
  }
  public async updateStatus(id: string, body: UpdateSchoolDTO, options?: IMongoTransaction) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid id');
    }
    if (!status.includes(body.status)) {
      throw new BadRequestException("Invalid status value");
    }
    const school = await this.findById(id);

    if (!school) {
      throw new BadRequestException('invalid id');
    }

    let password = school.password;

    if (school.status === Status.inactive) {
      password = generatePassword();
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }


    const updatedSchool = await this.schoolModel.findByIdAndUpdate(id, { ...body, password, status: body.status }, { ...options, new: true });

    if (updatedSchool.email && school.status === Status.inactive) {

      this.emailService.sendEmail(
        school.email,
        'BlackBoard Password',
        `<div>Please use this password for login. ${password}</div>`,
      );
    }

    return updatedSchool

  }
  public async createBlackboardSchool(body: CreateSchoolDTO) {
    const school = new this.schoolModel({ ...body, password: "" });
    await school.save();
    return { success: true, data: school };
  }
  public async updateBlackboardSchool(id: string, body: UpdateSchoolDTO, options?: IMongoTransaction) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid id');
    }

    const school = await this.findById(id);

    if (!school) {
      throw new BadRequestException('invalid id');
    }
    return await this.schoolModel.findByIdAndUpdate(id, { ...body }, { ...options, new: true });

  }
  public async delteBlackboardSchool(id: string, options?: IMongoTransaction) {
    return await this.schoolModel.findByIdAndDelete(id, { ...options, new: true });

  }
}
