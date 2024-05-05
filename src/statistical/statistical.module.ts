import { Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Article, ArticleSchema } from 'src/articles/schemas/article.schema';
import {
    LandlordRequest,
    LandlordRequestSchema,
} from 'src/landlord-request/schemas/landlord-request.schema';
import {
    Verification,
    VerificationSchema,
} from 'src/verification/schemas/verification.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: LandlordRequest.name, schema: LandlordRequestSchema },
        ]),
        MongooseModule.forFeature([
            { name: Verification.name, schema: VerificationSchema },
        ]),
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
        ]),
    ],
    controllers: [StatisticalController],
    providers: [StatisticalService],
})
export class StatisticalModule {}
