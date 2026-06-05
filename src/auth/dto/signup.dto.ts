import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ValidRoles } from '../enums/valid-role.enum';

export class SignUpDto {
    @IsString()
    name!: string;

    @IsString()
    lastName!: string;

    @IsString()
    sourName!: string;

    @IsString()
    @IsEmail()
    email!: string;

    @IsString()
    phone!: string;

    @IsString()
    @MinLength(6)
    secret!: string;

    @IsEnum(ValidRoles)
    @IsOptional()
    role?: ValidRoles;
}
