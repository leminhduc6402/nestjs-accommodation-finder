import { IsNotEmpty } from 'class-validator';

export class CreateSubcategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    active: boolean;

    @IsNotEmpty()
    type: string;

    // @IsNotEmpty()
    // categoryId: string;
}
