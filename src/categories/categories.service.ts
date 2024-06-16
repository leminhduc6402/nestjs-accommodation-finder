import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SubCategory } from 'src/subcategories/schemas/subcategory.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: SoftDeleteModel<CategoryDocument>,
        @InjectModel(SubCategory.name)
        private subCategoryModel: SoftDeleteModel<CategoryDocument>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto, user: IUser) {
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
    }

    async findAll(currentPage: number, limit: number, qs: string) {
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
            throw new BadRequestException('Not found category with id');
        }
        const category = await this.categoryModel
            .findById(id)
            .populate({
                path: 'createdBy',
                select: { fullName: 1, avatar: 1 },
            })
            .populate({
                path: 'subCategories',
                select: { name: 1, type: 1 },
            });
        return category;
    }

    async update(
        _id: string,
        updateCategoryDto: UpdateCategoryDto,
        user: IUser,
    ) {
        const category = await this.categoryModel.findById(_id);
        if (!category) {
            throw new NotFoundException();
        }
        const { name, subCategories } = updateCategoryDto;

        const isDuplicate = await this.categoryModel.findOne({ name });
        if (isDuplicate)
            throw new BadRequestException(`Name: ${name} already exists`);
        const updated = await this.categoryModel.findByIdAndUpdate(
            { _id },
            { name, subCategories, updatedBy: user._id },
            { new: true },
        );
        return updated;
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Cannot found this article';
        }
        await this.categoryModel.updateOne(
            { _id: id },
            {
                deletedBy: user._id,
            },
        );
        return this.categoryModel.softDelete({ _id: id });
    }
}
