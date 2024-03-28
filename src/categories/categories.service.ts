import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: SoftDeleteModel<CategoryDocument>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto, user: IUser) {
        try {
            const { name } = createCategoryDto;
            const isExist = await this.categoryModel.findOne({ name });
            if (isExist) {
                throw new BadRequestException(`Name: ${name} already exists`);
            }
            const category = await this.categoryModel.create({
                ...createCategoryDto,
                createdBy: user._id,
            });
            return category;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        try {
            const { filter, sort, population, projection } = aqp(qs);
            delete filter.current;
            delete filter.pageSize;

            let offset = (+currentPage - 1) * +limit;
            let defaultLimit = +limit ? +limit : 10;
            const totalItems = (await this.categoryModel.find(filter)).length;
            const totalPages = Math.ceil(totalItems / defaultLimit);

            const results = await this.categoryModel
                .find(filter)
                .select(projection)
                .skip(offset)
                .limit(defaultLimit)
                .sort(sort as any)
                .populate({
                    ...population,
                    path: 'createdBy updatedBy',
                    select: { fullName: 1, avatar: 1, email: 1, role: 1 },
                })
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
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findOne(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new BadRequestException('Not found category with id');
            }
            return await this.categoryModel.findById(id).populate({
                path: 'createdBy',
                select: { fullName: 1, avatar: 1 },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    update(_id: string, updateCategoryDto: UpdateCategoryDto, user: IUser) {
        try {
            return this.categoryModel.updateOne(
                {
                    _id,
                },
                {
                    ...updateCategoryDto,
                    updatedBy: user._id,
                },
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async remove(id: string, user: IUser) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return 'Cannot found this article';
            }
            await this.categoryModel.updateOne(
                { _id: id },
                {
                    deletedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
            return this.categoryModel.softDelete({ _id: id });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
