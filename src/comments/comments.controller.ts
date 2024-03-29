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
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({summary: "Create a comment"})
  @ResponseMessage('Create a comment')
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.create(createCommentDto, user);
  }

  @ApiOperation({summary: "Fetch comments by article id"})
  @ResponseMessage('Fetch comments by article id')
  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAllByArticleId(id);
  }

  @ApiOperation({summary: "Edit a comment"})
  @ResponseMessage('Edit a comment')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.update(id, updateCommentDto, user);
  }

  @ApiOperation({summary: "Remove a comment by id"})
  @ResponseMessage('Remove a comment by id')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.commentsService.remove(id, user);
  }

  @ApiOperation({summary: "Create a reply"})
  @ResponseMessage('Create a reply')
  @Patch(':id/reply')
  async addReply(
    @Param('id') id: string,
    @Body() createReplyDto: CreateReplyDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.addReply(id, createReplyDto, user);
  }

  @ApiOperation({summary: "Edit a reply"})
  @ResponseMessage('Edit a reply')
  @Put(':id/reply')
  async editReply(
    @Param('id') id: string,
    @Body() updateReplyDto: UpdateReplyDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.editReply(id, updateReplyDto, user);
  }

  @ApiOperation({summary: "Remove a reply"})
  @ResponseMessage('Remove a reply')
  @Delete(':id/reply/:repy_id')
  async removeReply(
    @Param('id') id: string,
    @Param('repy_id') repy_id: string,
    // @User() user: IUser,
  ) {
    return await this.commentsService.removeReply(id, repy_id);
  }
}
