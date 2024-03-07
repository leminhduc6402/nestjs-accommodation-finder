import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

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

    // @IsNotEmpty()
    // @MinLength(10)
    @ApiProperty({ required: false })
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    role: string;

    @ApiProperty({ required: false })
    streetAddress: string;

    @ApiProperty({ required: false })
    latitude: number;

    @ApiProperty({ required: false })
    longitude: number;

    @ApiProperty({ required: false })
    provinceCode: number;

    @ApiProperty({ required: false })
    districtCode: number;

    @ApiProperty({ required: false })
    wardCode: number;

    @ApiProperty({ required: false })
    provinceName: string;

    @ApiProperty({ required: false })
    districtName: string;

    @ApiProperty({ required: false })
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
