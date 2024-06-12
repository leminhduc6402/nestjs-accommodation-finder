import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import mongoose from 'mongoose';
import { SubCategory, SubCategoryDocument } from './schemas/subcategory.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class SubcategoriesService {
    constructor(
        @InjectModel(SubCategory.name)
        private subCategoryModel: SoftDeleteModel<SubCategoryDocument>,
    ) {}
    create(createSubcategoryDto: CreateSubcategoryDto) {
        return 'This action adds a new subcategory';
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
        const subcategories = await this.subCategoryModel.findById({
            categoryId,
        });
        return subcategories;
    }

    findOne(id: number) {
        return `This action returns a #${id} subcategory`;
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

    remove(id: number) {
        return `This action removes a #${id} subcategory`;
    }
}
