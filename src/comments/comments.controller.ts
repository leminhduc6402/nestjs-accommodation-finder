import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Public, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';

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

  
}
