import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CommentsService } from 'src/comments/comments.service';
import { IUser } from 'src/users/users.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateVerificationDto } from 'src/verification/dto/create-verification.dto';
import {
    Verification,
    VerificationDocument,
} from 'src/verification/schemas/verification.schema';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: SoftDeleteModel<ArticleDocument>,
        @InjectModel(Verification.name)
        private verificationModel: SoftDeleteModel<VerificationDocument>,
        private commentService: CommentsService,
    ) {}

    async create(createArticleDto: CreateArticleDto, user: IUser) {
        try {
            const {
                streetAddress,
                latitude,
                longitude,
                provinceCode,
                districtCode,
                wardCode,
                provinceName,
                districtName,
                wardName,
            } = createArticleDto;
            const article = await this.articleModel.create({
                ...createArticleDto,
                status: 'UNVERIFY',
                address: {
                    streetAddress,
                    provinceCode,
                    districtCode,
                    wardCode,
                    provinceName,
                    districtName,
                    wardName,
                },
                location: {
                    coordinates: [longitude, latitude],
                    type: 'Point',
                },
                createdBy: user._id,
            });

            return article;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.articleModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const results = await this.articleModel
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
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Not found article with id');
        }
        const article = await this.articleModel
            .findById(id)
            .populate({
                path: 'createdBy updatedBy',
                select: 'fullName email phone avatar name',
            })
            .populate({
                path: 'categoryId',
                select: { name: 1 },
            })
            .lean();

        const verificationResult = await this.verificationModel
            .find({ articleId: article._id })
            .sort({ createdBy: -1 })
            .limit(1);

        const comments = await this.commentService.findAllByArticleId(
            article._id.toString(),
        );
        return {
            article: {
                ...article,
                verificationStatus:
                    verificationResult.length !== 0
                        ? verificationResult[0].status
                        : null,
            },
            comments,
        };
    }

    update(_id: string, updateArticleDto: UpdateArticleDto, user: IUser) {
        return this.articleModel.updateOne(
            {
                _id,
            },
            {
                ...updateArticleDto,
                updatedBy: user._id,
            },
        );
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Cannot found this article';
        }
        await this.articleModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        return this.articleModel.softDelete({ _id: id });
    }

    async findByLocation(longitude: number, latitude: number) {
        const articles = await this.articleModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 3000, // 3km
                },
            },
        });
        return articles;
    }

    verify(_id: string, user: IUser) {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        return this.articleModel.updateOne(
            {
                _id,
            },
            {
                status: 'VERIFY',
                expiredAt: expirationDate.setMonth(
                    expirationDate.getMonth() + 1,
                ),
                updatedBy: user._id,
            },
        );
    }
}
