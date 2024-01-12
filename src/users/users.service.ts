import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User as UserModel, UserDocument, User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: Model<User>,
    private configService: ConfigService,
    // private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    const { fullName, email, password, avatar, phone, role, address } =
      createUserDto;
    const isExist = await this.userModel.find({ email });
    if (!isExist) {
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
      address,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Can not found this user';
    }
    const user = this.userModel.findOne({ _id: id }).select('-password');
    return user;
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
    return this.userModel.deleteOne({ _id: id });

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
