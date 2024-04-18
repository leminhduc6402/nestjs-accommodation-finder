import { IsEnum, IsNotEmpty } from 'class-validator';
import { landlordRequestStatusEnum } from 'src/enum/enum';

export class UpdateLandlordRequestDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEnum(landlordRequestStatusEnum)
    status: string;

    feedBack: string;
}
