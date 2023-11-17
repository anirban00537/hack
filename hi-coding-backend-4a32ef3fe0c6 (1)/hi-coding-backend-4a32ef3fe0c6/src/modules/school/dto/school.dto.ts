import { Status } from '@/utils/constants';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateSchoolDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  regNo: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsOptional()
  phone?: string;

  @Exclude()
  @ValidateIf(o => o.password === 'value')
  @IsOptional()
  password?: string
}

export class UpdateSchoolDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  regNo: string;

  @IsString()
  @IsOptional()
  contactPerson: string;

  @IsOptional()
  phone?: string;

  @IsEnum(Status)
  status: Status;


  @IsOptional()
  password?: string
}
