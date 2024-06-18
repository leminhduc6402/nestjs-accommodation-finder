import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import mongoose from 'mongoose';
import { SubCategory, SubCategoryDocument } from './schemas/subcategory.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';
import { Category, CategoryDocument } from 'src/categories/schemas/category.schema';

@Injectable()
export class SubcategoriesService {
    constructor(
        @InjectModel(SubCategory.name)
        private subCategoryModel: SoftDeleteModel<SubCategoryDocument>,
        @InjectModel(Category.name)
        private categoryModel: SoftDeleteModel<CategoryDocument>,
    ) {}
    async create(createSubcategoryDto: CreateSubcategoryDto, user: IUser) {
        return await this.subCategoryModel.create({
            ...createSubcategoryDto,
            createdBy: user._id,
        });
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);

        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.subCategoryModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const results = await this.subCategoryModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .populate(population)
            .select(projection as any)
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

    async findAllByCategoryId(categoryId: string) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new BadRequestException('Must be ObjectId');
        }
        const subcategories = (await this.categoryModel.findById(categoryId).populate('subCategories')).subCategories
        return subcategories;
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException('Not found permission');
        return await this.subCategoryModel.findById(id);
    }

    async update(
        id: string,
        updateSubcategoryDto: UpdateSubcategoryDto,
        user: IUser,
    ) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Must be ObjectId');
        }
        const updated = await this.subCategoryModel.findByIdAndUpdate(
            { id },
            { ...updateSubcategoryDto, updatedBy: user._id },
            { new: true },
        );
        return updated;
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'not found permission';
        }
        await this.subCategoryModel.updateOne(
            { _id: id },
            {
                deletedBy: user._id,
            },
        );
        return this.subCategoryModel.softDelete({ _id: id });
    }
}
