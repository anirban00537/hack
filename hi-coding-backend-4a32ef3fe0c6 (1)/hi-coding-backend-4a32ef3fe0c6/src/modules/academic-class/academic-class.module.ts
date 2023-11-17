import { Module, forwardRef } from '@nestjs/common';
import { AcademicClassController } from './academic-class.controller';
import { AcademicClassService } from './academic-class.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicClass, AcademicClassSchema } from '@/schemas/academicClass/academicClass';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: AcademicClass.name, schema: AcademicClassSchema }]),
  ],
  controllers: [AcademicClassController],
  providers: [AcademicClassService]
})
export class AcademicClassModule { }
