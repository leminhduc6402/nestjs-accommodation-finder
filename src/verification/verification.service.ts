import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
    Verification,
    VerificationDocument,
} from './schemas/verification.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { Article, ArticleDocument } from 'src/articles/schemas/article.schema';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: SoftDeleteModel<VerificationDocument>,
        @InjectModel(Article.name)
        private articleModel: SoftDeleteModel<ArticleDocument>,
    ) {}

    async create(createVerificationDto: CreateVerificationDto, user: IUser) {
        const { articleId } = createVerificationDto;
        const isExistArticle = await this.articleModel.findOne({
            _id: articleId,
        });
        if (!isExistArticle) {
            throw new NotFoundException('Not Found Article');
        }
        const isExistVerification = await this.verificationModel.findOne({
            articleId,
        });
        if (isExistVerification) {
            throw new BadRequestException('The verification already exists');
        }

        await this.articleModel.findOneAndUpdate(
            { _id: articleId },
            {
                status: 'PENDING',
            },
        );
        return await this.verificationModel.create(createVerificationDto);
    }

    findAll() {
        return `This action returns all verification`;
    }

    findOne(id: string) {
        return this.verificationModel
            .findById(id)
            .populate({ path: 'articleId' });
    }

    update(id: number, updateVerificationDto: UpdateVerificationDto) {
        return `This action updates a #${id} verification`;
    }

    remove(id: number) {
        return `This action removes a #${id} verification`;
    }
}
