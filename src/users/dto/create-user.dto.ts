import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
    // @ApiProperty({
    //   example: 'Nguyen Van A',
    // })
    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ required: false })
    avatar: string;

    @ApiProperty({ required: false })
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsMongoId()
    role: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    active?: boolean;

    @ApiProperty({ required: false })
    streetAddress?: string;

    @ApiProperty({ required: false })
    latitude?: number;

    @ApiProperty({ required: false })
    longitude?: number;

    @ApiProperty({ required: false })
    provinceCode?: string;

    @ApiProperty({ required: false })
    districtCode?: string;

    @ApiProperty({ required: false })
    wardCode?: string;

    @ApiProperty({ required: false })
    provinceName?: string;

    @ApiProperty({ required: false })
    districtName?: string;

    @ApiProperty({ required: false })
    wardName?: string;
}

export class RegisterUserDto {
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @ApiProperty({ required: false })
    @IsPhoneNumber('VN')
    phone: string;
}
export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: 'leminhduc6402@gmail.com',
        description: 'username',
    })
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123123',
        description: 'password',
    })
    readonly password: string;
}

export class UserLoginWithGGDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    avatar: string;
}

export class VerifyUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    passcode: string;
}
