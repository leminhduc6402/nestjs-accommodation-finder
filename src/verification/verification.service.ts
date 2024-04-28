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
import { ArticlesService } from 'src/articles/articles.service';
import aqp from 'api-query-params';
import { articleStatusEnum, verificationStatusEnum } from 'src/enum/enum';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: SoftDeleteModel<VerificationDocument>,
        private articleService: ArticlesService,
    ) {}

    async create(createVerificationDto: CreateVerificationDto, user: IUser) {
        const { articleId } = createVerificationDto;
        const isExistVerification = await this.verificationModel.findOne({
            articleId,
            status: verificationStatusEnum.PENDING,
        });
        const isVerification = await this.articleService.findOne(articleId);
        if (isVerification.article.status === articleStatusEnum.VERIFY) {
            throw new BadRequestException('The article is in verified status');
        }
        if (isExistVerification) {
            throw new BadRequestException(
                'The verification request already exists',
            );
        }

        return await this.verificationModel.create({
            ...createVerificationDto,
            status: verificationStatusEnum.PENDING,
            createdBy: user._id,
        });
    }

    async findAllByArticleId(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.verificationModel.find(filter)).length;
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
    }

    findOne(id: string) {
        return this.verificationModel
            .findById(id)
            .populate({ path: 'articleId' });
    }

    async update(updateVerificationDto: UpdateVerificationDto, user: IUser) {
        const { id, status, feedBack } = updateVerificationDto;
        const verification = await this.verificationModel.findById(id);
        if (verification === null) {
            throw new NotFoundException();
        }
        const { articleId } = verification;
        const article = await this.articleService.findOne(articleId + '');

        if (
            article.article.status !== articleStatusEnum.VERIFY &&
            verification.status === verificationStatusEnum.PENDING
        ) {
            if (
                verification.status === verificationStatusEnum.PENDING &&
                status === verificationStatusEnum.SUCCEED
            ) {
                // await this.articleService.changeStatus(
                //     articleId.toString(),
                //     articleStatusEnum.VERIFY,
                //     user,
                // );
                await this.articleService.verify(
                    articleId.toString(),
                    articleStatusEnum.VERIFY,
                    user,
                );
            }
            return await this.verificationModel.findOneAndUpdate(
                { _id: id },
                { status, feedBack },
                { new: true },
            );
        }
        throw new BadRequestException();
    }
}
