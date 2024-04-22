import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'src/comments/comments.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article, ArticleSchema } from './schemas/article.schema';
import { Verification, VerificationSchema } from 'src/verification/schemas/verification.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        CommentsModule,
        MailModule,
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
            { name: Verification.name, schema: VerificationSchema },
        ]),
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService],
    exports: [ArticlesService]
})
export class ArticlesModule {}