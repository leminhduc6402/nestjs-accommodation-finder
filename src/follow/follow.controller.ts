import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('Follow')
@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({summary: "Follow user"})
  @ResponseMessage('Follow user')
  @Post('follow')
  follow(@Body() createFollowDto: CreateFollowDto, @User() user: IUser) {
    return this.followService.follow(createFollowDto, user);
  }
  @ApiOperation({summary: "Unfollow user"})
  @ResponseMessage('Unfollow user')
  @Put('unFollow')
  unFollow(@Body() createFollowDto: CreateFollowDto, @User() user: IUser) {
    return this.followService.unFollow(createFollowDto, user);
  }

  // @Get()
  // findAll() {
  //   return this.followService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.followService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
  //   return this.followService.update(+id, updateFollowDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.followService.remove(+id);
  // }
}
