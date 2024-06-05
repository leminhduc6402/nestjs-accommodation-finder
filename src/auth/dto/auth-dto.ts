import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    passcode: number;
}

export class ChangePassword {
    @ApiProperty()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    reNewPassword: string;
}
export class ForgotPassword {
    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}
export class LoginWithSocialAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    access_token: string;
}
