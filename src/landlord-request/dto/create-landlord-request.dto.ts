import { IsNotEmpty } from 'class-validator';

export class CreateLandlordRequestDto {
    @IsNotEmpty()
    personalID: string;

    @IsNotEmpty()
    dayOfBirth: Date;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    nationality: string;

    @IsNotEmpty()
    dateOfIssue: Date;

    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    placeOfIssue: string;
}
