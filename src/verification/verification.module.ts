import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { ArticlesModule } from 'src/articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Verification,
    VerificationSchema,
} from './schemas/verification.schema';
import { Article, ArticleSchema } from 'src/articles/schemas/article.schema';

@Module({
    imports: [
        ArticlesModule,
        MongooseModule.forFeature([
            { name: Verification.name, schema: VerificationSchema },
            { name: Article.name, schema: ArticleSchema },
        ]),
    ],
    controllers: [VerificationController],
    providers: [VerificationService],
    exports: [VerificationService],
})
export class VerificationModule {}
