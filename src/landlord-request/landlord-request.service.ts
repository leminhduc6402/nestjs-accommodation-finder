import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateLandlordRequestDto } from './dto/create-landlord-request.dto';
import { UpdateLandlordRequestDto } from './dto/update-landlord-request.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
    LandlordRequest,
    LandlordRequestDocument,
} from './schemas/landlord-request.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { landlordRequestStatusEnum } from 'src/enum/enum';

@Injectable()
export class LandlordRequestService {
    constructor(
        @InjectModel(LandlordRequest.name)
        private landlordRequestModel: SoftDeleteModel<LandlordRequestDocument>,
    ) {}
    async create(
        createLandlordRequestDto: CreateLandlordRequestDto,
        user: IUser,
    ) {
        const isValid = await this.landlordRequestModel
            .find({
                createdBy: user._id,
            })
            .sort({ createdAt: -1 })
            .limit(1);
        if (isValid.length > 0) {
            if (isValid[0]?.status !== landlordRequestStatusEnum.REJECTED) {
                throw new BadRequestException(
                    `Your request is in status: ${isValid[0]?.status} `,
                );
            }
        }
        const landlordRequest = this.landlordRequestModel.create({
            ...createLandlordRequestDto,
            createdBy: user._id,
        });
        return landlordRequest;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.landlordRequestModel.find(filter))
            .length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const results = await this.landlordRequestModel
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
        return this.landlordRequestModel.findById(id).populate({
            path: 'createdBy updatedBy',
            select: { fullName: 1, avatar: 1, email: 1, role: 1 },
        });
    }

    async update(
        updateLandlordRequestDto: UpdateLandlordRequestDto,
        user: IUser,
    ) {
        const { id, status, feedBack } = updateLandlordRequestDto;
        const isExist = await this.landlordRequestModel.findById(id);
        if (!isExist) {
            throw new NotFoundException();
        }
        if (
            isExist.status === landlordRequestStatusEnum.PENDING &&
            status === landlordRequestStatusEnum.PENDING
        ) {
            throw new BadRequestException(
                `The request is in status: ${status}`,
            );
        }
        if (status === landlordRequestStatusEnum.APPROVED) {
            // Cập nhật role của người dùng dựa theo tên role FE gửi
        }
        return await this.landlordRequestModel
            .findOneAndUpdate(
                { _id: id },
                { status, feedBack, createdBy: user._id },
                { new: true },
            )
            .populate({
                path: 'createdBy',
                select: { fullName: 1, avatar: 1 },
            });
    }
}
