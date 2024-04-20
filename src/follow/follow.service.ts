import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { IUser } from 'src/users/users.interface';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UsersService } from 'src/users/users.service';
import { User as UserModel, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(Follow.name)
        private followModel: SoftDeleteModel<FollowDocument>,
        @InjectModel(UserModel.name)
        private userModel: SoftDeleteModel<UserDocument>,
        private userService: UsersService,
    ) {}

    async follow(createFollowDto: CreateFollowDto, user: IUser) {
        const { follower_id } = createFollowDto;
        const isExist = await this.userService.findOne(follower_id);
        if (!isExist) {
            throw new NotFoundException('Not found user');
        }
        const isValid = await this.userService.checkValidFollower(
            follower_id,
            user._id,
        );
        if (isValid) {
            throw new ConflictException();
        }
        await this.userModel.updateOne(
            { _id: follower_id },
            { $push: { followers: user._id } },
        );
        const owner = await this.userModel.updateOne(
            { _id: user._id },
            { $push: { followings: follower_id } },
        );

        return owner;
    }

    async unFollow(createFollowDto: CreateFollowDto, user: IUser) {
        const { follower_id } = createFollowDto;
        const isExist = await this.userService.findOne(follower_id);
        if (!isExist) {
            throw new NotFoundException('Not found user');
        }
        await this.userModel.updateOne(
            { _id: follower_id },
            { $pull: { followers: user._id } },
        );
        const owner = await this.userModel.updateOne(
            { _id: user._id },
            { $pull: { followings: follower_id } },
        );

        return owner;
    }

    // findAll() {
    //   return `This action returns all follow`;
    // }

    // findOne(id: number) {
    //   return `This action returns a #${id} follow`;
    // }

    // update(id: number, updateFollowDto: UpdateFollowDto) {
    //   return `This action updates a #${id} follow`;
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} follow`;
    // }
}
