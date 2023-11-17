import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { uniq } from 'lodash';
import * as brcypt from 'bcrypt';

import { User } from '@/schemas/user/user';
import { RegisterDTO } from '@/modules/auth/dto/auth.dto';
import { UserRole } from '@/schemas/userRole/userRole';
import { IMongoTransaction } from '@/decorators/mongoTransaction';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
  ) {}

  public async getUserRoles(roles: string[]) {
    return await this.userRoleModel.find({
      name: {
        $in: roles,
      },
    });
  }

  public async create(body: RegisterDTO, transaction?: IMongoTransaction) {
    const user = new this.userModel(body);
    await user.save(transaction);
    return { success: true };
  }

  public async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).populate('roles').lean();
  }

  public async findById(id: string) {
    return await this.userModel.findById(id).populate('roles').select('-password').lean();
  }

  public async addUserToSchoolOrCreateUser(body: RegisterDTO, transaction?: IMongoTransaction) {
    const user = await this.findByEmail(body.email);
    const userRoles = user.roles.map((role) => role.name);
    const roles = await this.getUserRoles(uniq([...body.roles, ...userRoles]));
    const roleIds = roles.map((role) => role._id.toString());
    const salt = await brcypt.genSalt(10);
    const password = await brcypt.hash(body.password, salt);
    if (user) {
      await this.userModel.findByIdAndUpdate(
        user._id,
        {
          ...body,
          password: user.password,
          roles: roleIds,
          school: body.school,
        },
        { new: true, ...transaction },
      );
      return { sendEmail: false };
    }

    await this.create(
      {
        ...body,
        // @ts-ignore
        roles: roleIds,
        school: body.school,
        password,
      },
      transaction,
    );
    return { sendEmail: true };
  }
}
