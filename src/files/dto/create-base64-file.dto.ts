import { IsNotEmpty } from 'class-validator';

export class CreateBase64FileDto {
    @IsNotEmpty()
    base64: string;
}
