import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateVerificationDto {
    @IsNotEmpty()
    latedImage: string[];

    @IsNotEmpty()
    contract: string[];

    @IsNotEmpty()
    video: string;

    @IsNotEmpty()
    @IsMongoId()
    articleId: string;

    status: string;
}
