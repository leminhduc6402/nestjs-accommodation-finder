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
import mongoose, { Model, ObjectId } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from './users.interface';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER } from 'src/databases/sample';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: SoftDeleteModel<UserDocument>,
        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
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

        const userRole = await this.roleModel.findOne({ name: USER });

        const hashPassword = this.hashPassword(password);

        let newRegister = await this.userModel.create({
            fullName,
            email,
            password: hashPassword,
            avatar: default_avatar,
            active: false,
            role: userRole?._id,
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
        const userRole = await this.roleModel.findOne({ name: USER });
        let newRegister = await this.userModel.create({
            fullName,
            email,
            avatar: avatar,
            active: true,
            role: userRole._id,
            // role: 'USER',
        });
        return newRegister;
    }

    findUserByToken = async (refreshToken: string) => {
        return await this.userModel
            .findOne({ refreshToken })
            .populate({ path: 'role', select: { name: 1 } })
            .populate({
                path: 'followings followers',
                select: { fullName: 1, avatar: 1 },
            });
    };

    checkValidFollower = async (followerId: string, userId: string) => {
        const user = await this.userModel.findOne({
            _id: followerId,
            followers: userId,
        });
        return !!user;
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
            .select('-password -refreshToken')
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

        const isExist = await this.userModel.findOne({ email, isDeleted: false });
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
                path: 'followings followers',
                select: { fullName: 1, avatar: 1, email: 1 },
            })
            .populate({
                path: 'role',
                select: { name: 1 },
            })
            .lean();
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.roleModel
            .findOne({ name: userRole.name })
            .populate({
                path: 'permissions',
                select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
            })
            .lean();
        return {
            ...user,
            permissions: (await temp).permissions ?? [],
        };
    }

    async findOneByEmail(email: string) {
        return this.userModel
            .findOne({
                email,
            })
            .populate({
                path: 'followers followings',
                select: { _id: 1, fullName: 1, avatar: 1 },
            })
            .populate({
                path: 'role',
                select: {
                    name: 1,
                },
            });
    }

    async update(updateUserDto: UpdateUserDto, user: IUser) {
        const {
            active,
            avatar,
            email,
            fullName,
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
        } = updateUserDto;

        // Tạo một đối tượng chỉ chứa các trường được cung cấp trong `updateUserDto`
        const updateFields: any = {
            active,
            avatar,
            email,
            fullName,
            phone,
            role,
            updatedBy: user._id,
        };

        if (streetAddress !== null && streetAddress !== undefined) {
            updateFields.address = { ...updateFields.address, streetAddress };
        }
        if (latitude !== null && latitude !== undefined) {
            updateFields.address = { ...updateFields.address, latitude };
        }
        if (longitude !== null && longitude !== undefined) {
            updateFields.address = { ...updateFields.address, longitude };
        }
        if (provinceCode !== null && provinceCode !== undefined) {
            updateFields.address = { ...updateFields.address, provinceCode };
        }
        if (districtCode !== null && districtCode !== undefined) {
            updateFields.address = { ...updateFields.address, districtCode };
        }
        if (wardCode !== null && wardCode !== undefined) {
            updateFields.address = { ...updateFields.address, wardCode };
        }
        if (provinceName !== null && provinceName !== undefined) {
            updateFields.address = { ...updateFields.address, provinceName };
        }
        if (districtName !== null && districtName !== undefined) {
            updateFields.address = { ...updateFields.address, districtName };
        }
        if (wardName !== null && wardName !== undefined) {
            updateFields.address = { ...updateFields.address, wardName };
        }

        return await this.userModel.findByIdAndUpdate(
            { _id: updateUserDto._id },
            updateFields,
            { new: true },
        );
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'not found user';
        }
        const foundUser = await this.userModel.findById(id);
        if (
            foundUser &&
            foundUser.email === this.configService.get<string>('EMAIL_ACCOUNT')
        )
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

    async changePassword(newPassword: string, user: IUser) {
        return await this.userModel.findOneAndUpdate(
            { _id: user._id },
            { password: this.hashPassword(newPassword), updatedBy: user._id },
            { new: true },
        );
    }

    async findOneAndUpdateRole(id: string, roleId: string) {
        return await this.userModel.findByIdAndUpdate(
            { _id: id },
            {
                role: roleId,
            },
            { new: true },
        );
    }
}
