import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateArticleDto {
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
    provinceCode: string;

    @IsNotEmpty()
    districtCode: string;

    @IsNotEmpty()
    wardCode: string;

    @IsNotEmpty()
    provinceName: string;

    @IsNotEmpty()
    districtName: string;

    @IsNotEmpty()
    wardName: string;

    @IsNotEmpty()
    @IsArray()
    images: string[];
}
export class ArticleQueryString {
    @ApiProperty({ required: false })
    categoryId: string;

    @ApiProperty({ required: false })
    title: string;

    @ApiProperty({ required: false })
    price: number;

    @ApiProperty({ required: false })
    acreage: number;

    @ApiProperty({ required: false })
    quantity: number;

    @ApiProperty({ required: false })
    status: string;

    @ApiProperty({ required: false })
    streetAddress: string;

    @ApiProperty({ required: false })
    provinceCode: number;

    @ApiProperty({ required: false })
    districtCode: number;

    @ApiProperty({ required: false })
    wardCode: number;
}
