import { Module } from '@nestjs/common';

import { UserController } from '@/modules/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRole, UserRoleSchema } from '@/schemas/userRole/userRole';
import { User, UserSchema } from '@/schemas/user/user';
import { UserService } from '@/modules/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
