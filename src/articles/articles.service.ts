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

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: SoftDeleteModel<ArticleDocument>,
    private configService: ConfigService,
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
      address: {
        streetAddress,
        latitude,
        longitude,
        provinceCode,
        districtCode,
        wardCode,
        provinceName,
        districtName,
        wardName,
      },
      createdBy: user._id,
    });

    return article;
  }

  // async findAll(currentPage: number, limit: number, qs: string) {
  //   const { filter, sort, population, projection } = aqp(qs);
  //   delete filter.current;
  //   delete filter.pageSize;

  //   let offset = (+currentPage - 1) * +limit;
  //   let defaultLimit = +limit ? +limit : 10;

  //   // Lấy số lượng bản ghi đã soft-delete
  //   const totalDeletedItems = (await this.articleModel.findDeleted()).length;

  //   // Lấy số lượng bản ghi chưa soft-delete
  //   const totalUndeletedItems = (await this.articleModel.find(filter)).length;

  //   const totalItems = totalDeletedItems + totalUndeletedItems;
  //   const totalPages = Math.ceil(totalItems / defaultLimit);

  //   // Lấy tất cả các bản ghi chưa soft-delete và thêm vào kết quả bản ghi đã soft-delete
  //   const results = await Promise.all([
  //     this.articleModel
  //       .find(filter)
  //       .skip(offset)
  //       .limit(defaultLimit)
  //       .sort(sort as any)
  //       .select(projection)
  //       .populate(population)
  //       .exec(),
  //     this.articleModel.findDeleted(),
  //   ]);

  //   return {
  //     meta: {
  //       current: currentPage, //trang hiện tại
  //       pageSize: limit, //số lượng bản ghi đã lấy
  //       pages: totalPages, //tổng số trang với điều kiện query
  //       total: totalItems, // tổng số phần tử (số bản ghi)
  //     },
  //     results: results.flat(), // kết quả query, nối kết quả đã soft-delete vào kết quả chưa soft-delete
  //   };
  // }

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
    return await this.articleModel.findById(id).populate({
      path: 'createdBy',
      select: 'fullName email phone avatar',
    });
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
}
