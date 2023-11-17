import { Module, forwardRef } from '@nestjs/common';
import { CalenderController } from './calender.controller';
import { CalenderService } from './calender.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Calender, CalenderSchema } from '@/schemas/calender/calender';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Calender.name, schema: CalenderSchema }]),
  ],
  controllers: [CalenderController],
  providers: [CalenderService]
})
export class CalenderModule { }
