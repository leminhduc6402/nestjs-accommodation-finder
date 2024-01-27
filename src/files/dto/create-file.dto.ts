import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  mimeType: string;

  @IsNotEmpty()
  size: number;

  @IsNotEmpty()
  key: string;
}
