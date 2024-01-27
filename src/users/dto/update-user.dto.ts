import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty()
  @IsNotEmpty({ message: 'The _id field cannot be empty' })
  _id: string;
}
