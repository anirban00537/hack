import { Module, forwardRef } from '@nestjs/common';

import { SchoolService } from '@/modules/school/school.service';
import { SchoolController } from '@/modules/school/school.controller';
import { UserModule } from '@/modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from '@/schemas/school/school';
import { EmailService } from '@/services/email/email.service';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
  ],
  providers: [SchoolService, EmailService],
  controllers: [SchoolController],
})
export class SchoolModule {}
