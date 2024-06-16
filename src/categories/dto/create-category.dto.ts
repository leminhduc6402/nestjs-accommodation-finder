import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    active: boolean;

    @IsNotEmpty()
    @IsMongoId({ each: true })
    @IsArray()
    subCategories: mongoose.Schema.Types.ObjectId[];
}
