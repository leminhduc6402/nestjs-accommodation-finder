import { IsEmail, IsNotEmpty } from 'class-validator';
import { Article } from 'src/articles/schemas/article.schema';

export class SendMailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class SendNewArticleDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    article: any;
}
