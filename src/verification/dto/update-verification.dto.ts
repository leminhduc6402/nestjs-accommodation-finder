import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { verificationStatusEnum } from 'src/enum/enum';

export class UpdateVerificationDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEnum(verificationStatusEnum)
    status: string;

    @IsString()
    feedBack: string;
}
