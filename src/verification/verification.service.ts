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
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: SoftDeleteModel<VerificationDocument>,
        @InjectModel(Article.name)
        private articleModel: SoftDeleteModel<ArticleDocument>,
        private articleService: ArticlesService,
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
                updatedBy: user._id,
            },
        );
        return await this.verificationModel.create({
            ...createVerificationDto,
            createdBy: user._id,
        });
    }

    findAll() {
        return `This action returns all verification`;
    }

    findOne(id: string) {
        return this.verificationModel
            .findById(id)
            .populate({ path: 'articleId' });
    }

    async update(id: string, status: string, user: IUser) {
        const verification = await this.verificationModel.findById(id);
        const { articleId } = verification;
        const article = await this.articleService.update(
            articleId.toString(),
            { status },
            user,
        );
        return article;
    }

    remove(id: number) {
        return `This action removes a #${id} verification`;
    }
}
