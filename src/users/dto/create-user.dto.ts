import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  MinLength,
  ValidateNested,
} from 'class-validator';

// export class Address {
//   @IsNotEmpty()
//   streetAddress: string;

//   @IsNotEmpty()
//   latitude: number;

//   @IsNotEmpty()
//   longitude: number;

//   @IsNotEmpty()
//   provinceCode: number;

//   @IsNotEmpty()
//   districtCode: number;

//   @IsNotEmpty()
//   wardCode: number;

//   @IsNotEmpty()
//   provinceName: string;

//   @IsNotEmpty()
//   districtName: string;

//   @IsNotEmpty()
//   wardName: string;
// }

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  avatar: string;

  @IsNotEmpty()
  @MinLength(10)
  phone: string;

  @IsNotEmpty()
  role: string;
  
  streetAddress: string;
  latitude: number;
  longitude: number;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  provinceName: string;
  districtName: string;
  wardName: string;
}

export class RegisterUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
