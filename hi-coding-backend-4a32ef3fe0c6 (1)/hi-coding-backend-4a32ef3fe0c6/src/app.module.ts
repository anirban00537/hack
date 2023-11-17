import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MongoModule } from '@/modules/mongo/mongo.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SchoolModule } from '@/modules/school/school.module';
import { EmailService } from '@/services/email/email.service';
import { AcademicClassModule } from './modules/academic-class/academic-class.module';
import { CalenderModule } from './modules/calender/calender.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: 60 * 60 },
      }),
      inject: [ConfigService],
    }),
    MongoModule,
    UserModule,
    AuthModule,
    SchoolModule,
    AcademicClassModule,
    CalenderModule,

  ],
  controllers: [AppController],
  providers: [Logger, AppService, EmailService],
})
export class AppModule { }
