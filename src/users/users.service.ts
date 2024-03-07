import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateUserDto,
    RegisterUserDto,
    UserLoginWithGGDto,
} from './dto/create-user.dto';
import { User as UserModel, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from './users.interface';

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
    async verifyUser(email: string) {
        return await this.userModel.findOneAndUpdate(
            { email },
            { active: true },
        );
    }

    updateUserToken = async (refreshToken: string, _id: string) => {
        return await this.userModel.updateOne({ _id }, { refreshToken });
    };

    async register(user: RegisterUserDto) {
        const { fullName, email, password } = user;
        const default_avatar = this.configService.get<string>('DEFAULT_IMAGE');
        //check email
        const isExist = await this.userModel.findOne({ email });
        if (isExist) {
            throw new BadRequestException(`Email: ${email} already exists`);
        }

        // const userRole = await this.roleModel.findOne({ name: USER_ROLE });

        const hashPassword = this.hashPassword(password);

        let newRegister = await this.userModel.create({
            fullName,
            email,
            password: hashPassword,
            avatar: default_avatar,
            active: false,
            // role: userRole._id,
            role: 'USER',
        });
        return newRegister;
    }

    async registerBySocialAccount(userLoginWithGGDto: UserLoginWithGGDto) {
        const { email, fullName, avatar } = userLoginWithGGDto;
        //check email
        const isExist = await this.userModel.findOne({ email });
        if (isExist) {
            throw new BadRequestException(`Email: ${email} already exists`);
        }

        let newRegister = await this.userModel.create({
            fullName,
            email,
            avatar: avatar,
            active: true,
            // role: userRole._id,
            role: 'USER',
        });
        return newRegister;
    }

    findUserByToken = async (refreshToken: string) => {
        return await this.userModel
            .findOne({ refreshToken })
            .populate({ path: 'role', select: { name: 1 } });
    };

    // CRUD user
    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

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
            active: true,
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
            throw new NotFoundException('Can not found this user');
        }
        const user = await this.userModel
            .findById(id)
            .select('-password -refreshToken')
            .populate({
                path: 'followings',
                select: { fullName: 1, avatar: 1 },
            })
            .populate({
                path: 'followers',
                select: { fullName: 1, avatar: 1 },
            });

        return user;
    }

    async findOneByEmail(email: string) {
        return this.userModel.findOne({
            email,
        });
        // .populate({ path: 'role', select: { name: 1 } });
    }

    async update(updateUserDto: UpdateUserDto, user: IUser) {
        return await this.userModel.updateOne(
            { _id: updateUserDto._id },
            {
                ...updateUserDto,
                updatedBy: user._id,
            },
        );
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'not found user';
        }
        const foundUser = await this.userModel.findById(id);
        if (foundUser && foundUser.email === 'leminhduc6402@gmail.com')
            throw new BadRequestException(
                'You do not have enough permission to remove this account',
            );

        await this.userModel.updateOne(
            { _id: id },
            {
                deletedBy: user._id,
            },
        );
        return this.userModel.softDelete({
            _id: id,
        });
    }

    async destroy(email: string) {
        await this.userModel.deleteOne({ email });
        return null;
    }
}
