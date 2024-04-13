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
import aqp from 'api-query-params';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: SoftDeleteModel<VerificationDocument>,
        private articleService: ArticlesService,
    ) {}

    async create(createVerificationDto: CreateVerificationDto, user: IUser) {
        try {
            const { articleId } = createVerificationDto;
            const isExistVerification = await this.verificationModel.findOne({
                articleId,
                status: 'PENDING',
            });
            if (isExistVerification) {
                throw new BadRequestException();
            }

            return await this.verificationModel.create({
                ...createVerificationDto,
                status: 'PENDING',
                createdBy: user._id,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findAllByArticleId(
        id: string,
        currentPage: number,
        limit: number,
        qs: string,
    ) {
        try {
            const { filter, sort, population, projection } = aqp(qs);
            delete filter.current;
            delete filter.pageSize;

            let offset = (+currentPage - 1) * +limit;
            let defaultLimit = +limit ? +limit : 10;
            const totalItems = (await this.verificationModel.find(filter))
                .length;
            const totalPages = Math.ceil(totalItems / defaultLimit);

            const results = await this.verificationModel
                .find(filter)
                .skip(offset)
                .limit(defaultLimit)
                .sort(sort as any)
                .select(projection)
                .populate(population)
                .exec();

            return {
                meta: {
                    current: currentPage,
                    pageSize: limit,
                    pages: totalPages,
                    total: totalItems,
                },
                results,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    findOne(id: string) {
        try {
            return this.verificationModel
                .findById(id)
                .populate({ path: 'articleId' });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(id: string, status: string, user: IUser) {
        try {
            const verification = await this.verificationModel.findById(id);
            const { articleId } = verification;
            const article = await this.articleService.findOne(articleId + '');
            if (!verification || !article) {
                throw new NotFoundException();
            }
            if (
                verification.status === 'SUCCESS' &&
                article.article.status === 'VERIFY'
            ) {
                throw new BadRequestException();
            }
            if (
                verification.status === 'PENDING' &&
                article.article.status === 'UNVERIFY'
            ) {
                throw new BadRequestException();
            }
            await this.articleService.update(
                articleId.toString(),
                { status },
                user,
            );
            return await this.verificationModel.findOneAndUpdate(
                { _id: id },
                { status },
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    remove(id: number) {
        return `This action removes a #${id} verification`;
    }
}
