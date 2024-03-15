import { Type } from 'class-transformer';
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
}
