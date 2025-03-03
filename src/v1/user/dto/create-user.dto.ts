import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { UserRole, UserRoleType } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;
  @ApiProperty({ example: 'john.doe@exemple.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'super_strong_passord', maximum: 72, minimum: 8 })
  @Length(8, 72)
  password: string;
  @ApiProperty({ default: UserRole.USER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRoleType;
}
