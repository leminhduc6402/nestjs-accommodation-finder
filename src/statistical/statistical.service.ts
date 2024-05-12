import { Injectable } from '@nestjs/common';
import { StatisticalDto } from './dto/create-statistical.dto';
import { UpdateStatisticalDto } from './dto/update-statistical.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { statisticalTypeEnum } from 'src/enum/enum';
import { Model } from 'mongoose';
import moment from 'moment';
import { Article } from 'src/articles/schemas/article.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { Verification } from 'src/verification/schemas/verification.schema';
import { LandlordRequest } from 'src/landlord-request/schemas/landlord-request.schema';

@Injectable()
export class StatisticalService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel(Article.name)
        private articleModel: Model<User>,
        @InjectModel(Verification.name)
        private verificationModel: Model<Verification>,
        @InjectModel(LandlordRequest.name)
        private landlordRequestModel: Model<LandlordRequest>,
    ) {}
    async findAll() {
        const user = await this.userModel.countDocuments();
        const article = await this.articleModel.countDocuments();
        const landlordRequest =
            await this.landlordRequestModel.countDocuments();
        const verification = await this.verificationModel.countDocuments();
        return {
            user,
            article,
            landlordRequest,
            verification,
        };
    }

    async getUserStatistics() {
        const aggregationPipeline = [
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role',
                },
            },
            {
                $unwind: '$role',
            },
            {
                $group: {
                    _id: '$role.name',
                    total: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    role: '$_id',
                    total: 1,
                },
            },
        ];

        return await this.userModel.aggregate(aggregationPipeline);
    }

    async getArticleStatistics(statisticalDto: StatisticalDto) {
        const { fromDate, toDate, type } = statisticalDto;
        const from = moment(fromDate, 'DD/MM/YYYY').toDate();
        const to = moment(toDate, 'DD/MM/YYYY').toDate();
        let aggregationPipeline = [];
        switch (type) {
            case statisticalTypeEnum.DAY:
                aggregationPipeline = [
                    {
                        $match: {
                            createdAt: {
                                $gte: from,
                                $lte: to,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                day: { $dayOfMonth: '$createdAt' },
                            },
                            date: { $first: '$createdAt' },
                            quantity: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day',
                            date: '$date',
                            quantity: 1,
                        },
                    },
                ];
                break;
            case statisticalTypeEnum.MONTH:
                aggregationPipeline = [
                    {
                        $match: {
                            createdAt: {
                                $gte: from,
                                $lte: to,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                            },
                            quantity: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            months: '$_id.month',
                            quantity: 1,
                        },
                    },
                ];
                break;
            case statisticalTypeEnum.YEAR:
                aggregationPipeline = [
                    {
                        $match: {
                            createdAt: {
                                $gte: from,
                                $lte: to,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$createdAt' },
                            },
                            quantity: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            year: '$_id.year',
                            quantity: 1,
                        },
                    },
                ];
                break;
        }
        const demo = await this.articleModel
            .aggregate(aggregationPipeline)
            .sort('day');
        return demo;
    }

    create(statisticalDto: StatisticalDto) {
        return 'This action adds a new statistical';
    }

    findOne(id: number) {
        return `This action returns a #${id} statistical`;
    }

    update(id: number, updateStatisticalDto: UpdateStatisticalDto) {
        return `This action updates a #${id} statistical`;
    }

    remove(id: number) {
        return `This action removes a #${id} statistical`;
    }
}
