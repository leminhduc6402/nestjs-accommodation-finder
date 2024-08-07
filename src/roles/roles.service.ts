import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ADMIN } from 'src/databases/sample';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,
    ) {}

    async create(createRoleDto: CreateRoleDto, user: IUser) {
        const { name, description, isActive, permissions } = createRoleDto;

        const isExist = await this.roleModel.findOne({ name });
        if (isExist)
            throw new BadRequestException(
                `Role with name=${name} already exists`,
            );

        const newRole = await this.roleModel.create({
            name,
            description,
            isActive,
            permissions,
            createdBy: user._id,
        });

        return newRole;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);

        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.roleModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const results = await this.roleModel
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

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException('Not found role');

        return await this.roleModel
            .findById(id)
            .populate({
                path: 'permissions',
                select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
            })
            .populate({
                path: 'createdBy',
                select: { fullName: 1, email: 1, avatar: 1 },
            });
    }

    async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            throw new BadRequestException('Not found role');
        }
        const { name, description, isActive, permissions } = updateRoleDto;
        if (name === ADMIN && user.email !== 'leminhduc6402@gmail.com') {
            throw new BadRequestException('Can not update this role');
        }
        const updated = await this.roleModel.findByIdAndUpdate(
            { _id },
            {
                name,
                description,
                isActive,
                permissions,
                updatedBy: user._id,
            },
            { new: true },
        );

        return updated;
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Not found role');
        }
        const foundRole = await this.roleModel.findById(id);
        if (foundRole.name === ADMIN) {
            throw new BadRequestException("Can't not remove this role");
        }
        const checkValidUsedRole = await this.userModel.find({ role: id });
        if (checkValidUsedRole) {
            throw new BadRequestException('This role is in use');
        }
        await this.roleModel.updateOne(
            { _id: id },
            {
                deletedBy: user._id,
            },
        );
        return this.roleModel.deleteOne({ _id: id });
    }
}
