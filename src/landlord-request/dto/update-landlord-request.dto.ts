import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { landlordRequestStatusEnum } from 'src/enum/enum';

export class UpdateLandlordRequestDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEnum(landlordRequestStatusEnum)
    status: landlordRequestStatusEnum;

    @IsString()
    feedBack: string;

    @IsNotEmpty()
    roleId: string;
}
