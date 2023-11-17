import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '@/utils/constants';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(4)
  username: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsArray()
  @IsOptional()
  @IsString()
  school?: string[];
}

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(6)
  password: string;
}
