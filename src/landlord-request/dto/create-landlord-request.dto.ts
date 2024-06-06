import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';
import { genderEnum, landlordRequestStatusEnum } from 'src/enum/enum';

export class CreateLandlordRequestDto {
    @IsNotEmpty()
    images: string[];
    
    @IsNotEmpty()
    personalID: string;

    @IsNotEmpty()
    dayOfBirth: Date;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsEnum(genderEnum)
    gender: string;

    @IsNotEmpty()
    nationality: string;

    @IsNotEmpty()
    dateOfIssue: Date;

    @IsNotEmpty()
    // @IsEnum(landlordRequestStatusEnum)
    status: landlordRequestStatusEnum;

    @IsNotEmpty()
    placeOfIssue: string;
}
