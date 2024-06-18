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
import { CreateArticleDto, RecommendationDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateVerificationDto } from 'src/verification/dto/create-verification.dto';
import {
    Verification,
    VerificationDocument,
} from 'src/verification/schemas/verification.schema';
import { articleStatusEnum } from 'src/enum/enum';
import { MailService } from 'src/mail/mail.service';
import { SendNewArticleDto } from 'src/mail/dto/mail.dto';
import { UsersService } from 'src/users/users.service';
import * as natural from 'natural';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name)
        private articleModel: SoftDeleteModel<ArticleDocument>,
        @InjectModel(Verification.name)
        private verificationModel: SoftDeleteModel<VerificationDocument>,
        private commentService: CommentsService,
        private usersService: UsersService,
        private mailService: MailService,
    ) {}

    async create(createArticleDto: CreateArticleDto, user: IUser) {
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
            status: articleStatusEnum.UNVERIFY,
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

        const data = await this.articleModel
            .findById(article._id)
            .populate({
                path: 'createdBy',
                select: { fullName: 1, phone: 1, email: 1 },
            })
            .populate({
                path: 'categoryId',
                select: { name: 1 },
            });
        const arrFollower = (await this.usersService.findOne(user._id))
            .followers;
        arrFollower.forEach((item) => {
            const sendNewArticleDto: SendNewArticleDto = {
                article: data,
                email: item.email,
            };
            this.mailService.sendNewArticleEmail(sendNewArticleDto);
        });

        return article;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        console.log(filter);
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
            .sort({ createdAt: -1 })
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

    update(updateArticleDto: UpdateArticleDto, user: IUser) {
        const { _id } = updateArticleDto;
        return this.articleModel.findByIdAndUpdate(
            {
                _id,
            },
            {
                ...updateArticleDto,
                updatedBy: user._id,
            },
            { new: true },
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

    verify(_id: string, status: string, user: IUser) {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        expirationDate.setDate(expirationDate.getDate() + 1);
        expirationDate.setHours(0, 0, 0, 0);

        return this.articleModel.updateOne(
            {
                _id,
            },
            {
                status: status,
                expiredAt: expirationDate.setMonth(expirationDate.getMonth()),
                updatedBy: user._id,
            },
        );
    }

    async markArticleAsUnverified() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        today.setDate(today.getDate() + 1);
        const updated = await this.articleModel.updateMany(
            {
                status: articleStatusEnum.VERIFY,
                expiredAt: today,
            },
            {
                status: articleStatusEnum.UNVERIFY,
            },
        );
        return !!updated;
    }

    // async getRecommendations(articleId: string) {
    //     const articles = await this.articleModel.find();
    //     const article = await this.articleModel.findById(articleId);

    //     const tfidf = new natural.TfIdf();
    //     articles.forEach((article) => tfidf.addDocument(article.title));

    //     const articleTitle = new natural.TfIdf();
    //     articleTitle.addDocument(article.title);
    //     const scores = articles.map((article, index) => {
    //         const similarityArray = tfidf.tfidfs(
    //             article.title,
    //             articleTitle[0],
    //         );
    //         if (!Array.isArray(similarityArray)) {
    //             throw new Error('TF-IDF calculation failed');
    //         }

    //         const averageSimilarity =
    //             similarityArray.reduce((acc, val) => acc + val, 0) /
    //             similarityArray.length;
    //         return { article, score: averageSimilarity };
    //     });

    //     scores.sort((a, b) => b.score - a.score);
    //     return scores.slice(0, 5).map((score) => score.article);
    // }

    async getRecommendations(id: string) {
        const selectedArticle = await this.articleModel.findById(id);
        const selectedArticleWords = [
            ...new Set(selectedArticle.title.toLowerCase().split(' ')),
        ];

        const articles = await this.articleModel
            .find({ categoryId: selectedArticle.categoryId, _id: { $ne: id } })
            .limit(10)
            .sort('-updatedDate');

        const articleWords = articles.map((article) => ({
            _id: article._id + '',
            words: article.title.toLowerCase().split(' '),
        }));

        const tfIdfScores = articleWords.map((article) => ({
            _id: article._id,
            score: this.calculateTfIdf(
                selectedArticleWords,
                article.words,
                articleWords,
            ),
        }));

        tfIdfScores.sort((a, b) => b.score - a.score);
        // Lọc các bài viết có score > 0, sau đó sắp xếp theo score giảm dần
        const filteredScores = tfIdfScores
            .filter((article) => article.score > 0)
            .sort((a, b) => b.score - a.score);

        // Lấy ra 5 ID đầu tiên từ các bài viết đã lọc và sắp xếp
        const ids = filteredScores.slice(0, 5).map((article) => article._id);

        const recommendationArticles = await this.articleModel.find({
            _id: ids,
        });
        return recommendationArticles;
    }

    // Hàm tính tf
    termFrequency(term: string, words: string[]) {
        const termCount = words.filter((word) => word === term).length;
        return termCount / words.length;
    }

    // Hàm tính idf
    inverseDocumentFrequency(
        term: string,
        docs: { _id: string; words: string[] }[],
    ) {
        const numDocsWithTerm = docs.filter((doc) =>
            doc.words.includes(term),
        ).length;
        return Math.log(docs.length / (1 + numDocsWithTerm));
    }

    // Hàm tính tf-idf
    calculateTfIdf(
        selectedArticleWords: string[],
        articleWords: string[],
        docs: { _id: string; words: string[] }[],
    ) {
        let tfIdfScore = 0;

        selectedArticleWords.forEach((term) => {
            const tf = this.termFrequency(term, articleWords);
            const idf = this.inverseDocumentFrequency(term, docs);
            tfIdfScore += tf * idf;
        });

        return tfIdfScore;
    }
}
