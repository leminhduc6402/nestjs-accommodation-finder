import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User as UserModel, UserDocument, User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: SoftDeleteModel<UserDocument>,

    private configService: ConfigService,
  ) {}
  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // const searchConditions = {};
    // const { current, pageSize, ...queryString }: any = qs;

    // Object.keys(queryString).forEach((field) => {
    //   searchConditions[field] = { $regex: new RegExp(queryString[field], 'i') };
    // });
    // const users = await this.userModel.find(searchConditions);

    const results = await this.userModel
      .find(filter)
      .select('-password')
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

  async create(createUserDto: CreateUserDto) {
    const {
      fullName,
      email,
      password,
      avatar,
      phone,
      role,
      streetAddress,
      latitude,
      longitude,
      provinceCode,
      districtCode,
      wardCode,
      provinceName,
      districtName,
      wardName,
    } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} already exists`);
    }

    const default_avatar = this.configService.get<string>('DEFAULT_IMAGE');

    const hashPassword = this.hashPassword(password);
    const user = await this.userModel.create({
      fullName,
      email,
      password: hashPassword,
      avatar: avatar || default_avatar,
      isActive: true,
      phone,
      role,
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
    });
    return user;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Can not found this user';
    }
    const user = this.userModel.findOne({ _id: id }).select('-password');
    return user;
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
    // .populate({ path: 'role', select: { name: 1 } });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Can not found this user';
    }
    return this.userModel.softDelete({ _id: id });

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return 'not found user';
    // }
    // const foundUser = await this.userModel.findById(id);
    // if (foundUser && foundUser.email === 'leminhduc6402@gmail.com')
    //   throw new BadRequestException('Không thể xoá tài khoản này');

    // await this.userModel.updateOne(
    //   { _id: id },
    //   {
    //     deletedBy: {
    //       _id: user._id,
    //       email: user.email,
    //     },
    //   },
    // );
    // return this.userModel.softDelete({
    //   _id: id,
    // });
  }
}
