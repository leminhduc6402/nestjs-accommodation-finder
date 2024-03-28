import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from 'src/articles/articles.module';
import {
    Verification,
    VerificationSchema,
} from './schemas/verification.schema';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
    imports: [
        ArticlesModule,
        MongooseModule.forFeature([
            { name: Verification.name, schema: VerificationSchema },
        ]),
    ],
    controllers: [VerificationController],
    providers: [VerificationService],
    exports: [VerificationService],
})
export class VerificationModule {}
