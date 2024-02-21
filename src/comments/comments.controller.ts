import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { UpdateCommentDto, UpdateReplyDto } from './dto/update-comment.dto';
import { Public, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.create(createCommentDto, user);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAllByArticleId(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.commentsService.remove(id, user);
  }

  @Patch(':id/reply')
  async addReply(
    @Param('id') id: string,
    @Body() createReplyDto: CreateReplyDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.addReply(id, createReplyDto, user);
  }

  @Put(':id/reply')
  async editReply(
    @Param('id') id: string,
    @Body() updateReplyDto: UpdateReplyDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.editReply(id, updateReplyDto, user);
  }

  @Delete(':id/reply/:repy_id')
  async removeReply(
    @Param('id') id: string,
    @Param('repy_id') repy_id: string,
    // @User() user: IUser,
  ) {
    return await this.commentsService.removeReply(id, repy_id);
  }
}
