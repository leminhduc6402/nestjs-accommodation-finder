import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,
    ) {}

    async create(createPermissionDto: CreatePermissionDto, user: IUser) {
        const { name, apiPath, method, module } = createPermissionDto;
        const isExist = await this.permissionModel.findOne({ apiPath, method });
        if (isExist)
            throw new BadRequestException(
                `Permission with apiPath=${apiPath}, method=${method} already exists`,
            );

        const newPermission = await this.permissionModel.create({
            name,
            apiPath,
            method,
            module,
            createdBy: user._id,
        });
        return newPermission;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);

        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.permissionModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const results = await this.permissionModel
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
            throw new BadRequestException('Not found permission');
        return await this.permissionModel.findById(id);
    }

    async update(
        _id: string,
        updatePermissionDto: UpdatePermissionDto,
        user: IUser,
    ) {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            throw new BadRequestException('Not found user');
        }
        const { module, method, apiPath, name } = updatePermissionDto;
        const updated = await this.permissionModel.findByIdAndUpdate(
            { _id },
            {
                module,
                method,
                apiPath,
                name,
                updatedBy: user._id,
            },
            { new: true },
        );
        return updated;
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'not found permission';
        }
        await this.permissionModel.updateOne(
            { _id: id },
            {
                deletedBy: user._id,
            },
        );
        return this.permissionModel.softDelete({ _id: id });
    }
}
