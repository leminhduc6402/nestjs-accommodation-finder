import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateArticleDto {
    @IsNotEmpty({ message: 'The _id field cannot be empty' })
    _id: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    categoryId: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    acreage: number;

    status: string;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    streetAddress: string;

    @IsNotEmpty()
    latitude: number;

    @IsNotEmpty()
    longitude: number;

    @IsNotEmpty()
    provinceCode: number;

    @IsNotEmpty()
    districtCode: number;

    @IsNotEmpty()
    wardCode: number;

    @IsNotEmpty()
    provinceName: string;

    @IsNotEmpty()
    districtName: string;

    @IsNotEmpty()
    wardName: string;

    @IsNotEmpty()
    @IsArray()
    images: string[];

    @IsNotEmpty()
    @IsArray()
    attributes: [string];
}
