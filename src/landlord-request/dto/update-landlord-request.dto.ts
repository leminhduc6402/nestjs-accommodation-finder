import { IsNotEmpty } from 'class-validator';

export class UpdateLandlordRequestDto {
    id: string;

    @IsNotEmpty()
    status: string;

    feedBack: string;
}
