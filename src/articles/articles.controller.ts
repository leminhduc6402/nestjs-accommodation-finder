import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/users/users.interface';
@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Create an article' })
  @ResponseMessage('Create an article')
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @User() user: IUser) {
    return this.articlesService.create(createArticleDto, user);
  }

  @Public()
  @ApiOperation({ summary: 'Get all article with pagination' })
  @ResponseMessage('fetch article with pagination')
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.articlesService.findAll(+currentPage, +limit, qs);
  }

  @ApiOperation({ summary: 'Get an article by id' })
  @ResponseMessage("Get an article")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an article' })
  @ResponseMessage('Update an article')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @User() user: IUser,
  ) {
    return this.articlesService.update(id, updateArticleDto, user);
  }

  @ApiOperation({ summary: 'Delete an article' })
  @ResponseMessage('Delete an article')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.articlesService.remove(id, user);
  }
}
