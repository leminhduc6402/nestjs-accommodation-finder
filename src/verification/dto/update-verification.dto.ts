import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { verificationStatusEnum } from 'src/enum/enum';

export class UpdateVerificationDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEnum(verificationStatusEnum)
    status: string;

    feedBack: string;
}
