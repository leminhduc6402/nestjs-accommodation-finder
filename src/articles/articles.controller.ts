import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ArticlesService } from './articles.service';
import {
    ArticleQueryString,
    CreateArticleDto,
    RecommendationDto,
} from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @UseGuards(ThrottlerGuard)
    @ApiOperation({ summary: 'Create an article' })
    @ResponseMessage('Create an article')
    @Post()
    create(@Body() createArticleDto: CreateArticleDto, @User() user: IUser) {
        return this.articlesService.create(createArticleDto, user);
    }

    @Public()
    @ApiQuery({ type: ArticleQueryString })
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

    @Public()
    @ApiOperation({ summary: 'Get an article by id' })
    @ResponseMessage('Get an article by id')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.articlesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an article' })
    @ResponseMessage('Update an article')
    @Patch('')
    update(@Body() updateArticleDto: UpdateArticleDto, @User() user: IUser) {
        return this.articlesService.update(updateArticleDto, user);
    }

    @ApiOperation({ summary: 'Remove an article' })
    @ResponseMessage('Delete an article')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.articlesService.remove(id, user);
    }

    @Public()
    @ApiOperation({ summary: 'Get an article by location' })
    @ResponseMessage('Get an article by location')
    @Get('maps/search-by-location')
    findByLocation(
        @Query('longitude') longitude: string,
        @Query('latitude') latitude: string,
    ) {
        return this.articlesService.findByLocation(+longitude, +latitude);
    }

    @Public()
    @ApiOperation({ summary: 'Get recommendation articles' })
    @ResponseMessage('Get recommendation articles')
    @Get('getRecommodations/:id')
    getRecommendations(@Param('id') id: string) {
        return this.articlesService.getRecommendations(id);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    handleCron() {
        return this.articlesService.markArticleAsUnverified();
    }
}
