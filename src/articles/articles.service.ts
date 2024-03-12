import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { CommentsService } from 'src/comments/comments.service';
import path from 'path';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: SoftDeleteModel<ArticleDocument>,
        private configService: ConfigService,
        private commentService: CommentsService,
    ) {}

    async create(createArticleDto: CreateArticleDto, user: IUser) {
        // await this.articleModel.createIndexes();
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
                current: currentPage, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems, // tổng số phần tử (số bản ghi)
            },
            results, //kết quả query
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
            });
        const comments = await this.commentService.findAllByArticleId(
            article._id.toString(),
        );
        return { article, comments };
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
}
