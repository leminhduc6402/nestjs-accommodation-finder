import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
