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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @ApiOperation({ summary: 'Create a category' })
    @ResponseMessage('Create a category')
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
        return this.categoriesService.create(createCategoryDto, user);
    }

    @Public()
    @ApiQuery({ name: 'name', required: false, example: '/Nhà/i' })
    @ApiOperation({ summary: 'Get all categories with pagination' })
    @ResponseMessage('fetch categories with pagination')
    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.categoriesService.findAll(+currentPage, +limit, qs);
    }

    @Public()
    @ApiOperation({ summary: 'Get a category by id' })
    @ResponseMessage('Get a category by id')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a category' })
    @ResponseMessage('Update a category')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @User() user: IUser,
    ) {
        return this.categoriesService.update(id, updateCategoryDto, user);
    }

    @ApiOperation({ summary: 'Remove a category' })
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.categoriesService.remove(id, user);
    }
}
