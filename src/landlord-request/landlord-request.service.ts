import { Injectable } from '@nestjs/common';
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
        // const isValid = await
        const landlordRequest = this.landlordRequestModel.create({
            ...createLandlordRequestDto,
            createdBy: user._id,
        });
        return landlordRequest;
    }

    async findAllByUserId(currentPage: number, limit: number, qs: string) {
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
        return this.landlordRequestModel
            .findById(id)
            .populate({
                path: 'createdBy updatedBy',
                select: { fullName: 1, avatar: 1, email: 1, role: 1 },
            });
    }

    update(id: number, updateLandlordRequestDto: UpdateLandlordRequestDto) {
        return `This action updates a #${id} landlordRequest`;
    }

    remove(id: number) {
        return `This action removes a #${id} landlordRequest`;
    }
}
