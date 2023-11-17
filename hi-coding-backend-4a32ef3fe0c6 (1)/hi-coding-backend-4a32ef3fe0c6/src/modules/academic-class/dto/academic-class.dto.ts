import { Status } from '@/utils/constants';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateAcademicClassDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  school: string;


  @IsOptional()
  description?: string;


  @IsOptional()
  status?: string
}

export class UpdateAcademicClassDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  school: string;


  @IsOptional()
  description?: string;


  @IsOptional()
  status?: string
}
