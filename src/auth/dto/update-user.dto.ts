import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ValidRoles } from '../enums/valid-role.enum';

export class UpdateUserDto {
  @IsString()
  readonly name!: string;

  @IsString()
  readonly lastName!: string;

  @IsString()
  readonly sourName!: string;

  @IsEmail()
  readonly email!: string;

  @IsString()
  readonly phone!: string;

  @IsString()
  @MinLength(6)
  secret!: string;

  @IsEnum(ValidRoles)
  @IsOptional()
  readonly role?: ValidRoles;

  @IsString()
  readonly updatedAt!: string;
}
