import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
    Permission,
    PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN, INIT_PERMISSIONS, USER } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,

        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,

        private configService: ConfigService,
        private userService: UsersService,
    ) {}

    async onModuleInit() {
        const isInit = this.configService.get<string>('IS_INIT');
        if (Boolean(isInit)) {
            const countUser = await this.userModel.countDocuments({});
            const countPermission = await this.permissionModel.countDocuments(
                {},
            );
            const countRole = await this.roleModel.countDocuments({});

            if (countPermission === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS);
            }

            if (countRole === 0) {
                const permissions = await this.permissionModel
                    .find()
                    .select('_id');
                await this.roleModel.insertMany([
                    {
                        name: ADMIN,
                        description: 'Admin có toàn quyền sử dụng hệ thống',
                        isActive: true,
                        permissions: permissions,
                    },
                    {
                        name: USER,
                        description: 'Người dùng sử dụng hệ thống',
                        isActive: true,
                        permissions: [],
                    },
                ]);
            }

            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({ name: ADMIN });
                const userRole = await this.roleModel.findOne({ name: USER });

                await this.userModel.insertMany([
                    {
                        fullName: 'Lê Huỳnh Đức (Admin)',
                        email: 'leminhduc6402@gmail.com',
                        password: this.userService.hashPassword(
                            this.configService.get<string>('INIT_PASSWORD'),
                        ),
                        phone: '0366004732',
                        role: adminRole?._id,
                    },
                    {
                        fullName: 'Trương Thành Đạt (Admin)',
                        email: 'truongthanhdat2002@gmail.com',
                        password: this.userService.hashPassword(
                            this.configService.get<string>('INIT_PASSWORD'),
                        ),
                        phone: '0366004732',
                        role: adminRole?._id,
                    },
                    {
                        fullName: 'Lê Minh Đức',
                        email: 'ducprotc456@gmail.com',
                        password: this.userService.hashPassword(
                            '123123',
                        ),
                        phone: '0366004733',
                        role: userRole?._id,
                    },
                ]);
            }
            if (countUser > 0 && countRole > 0 && countPermission > 0) {
                this.logger.log('>> ALREADY INIT DATA...');
            }
        }
    }
}
