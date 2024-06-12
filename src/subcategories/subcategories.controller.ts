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
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('SubCategory')
@Controller('subcategories')
export class SubcategoriesController {
    constructor(private readonly subcategoriesService: SubcategoriesService) {}

    @ApiOperation({ summary: 'Create a new SubCategory' })
    @ResponseMessage('Create a new SubCategory')
    @Post()
    create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
        return this.subcategoriesService.create(createSubcategoryDto);
    }

    @ApiOperation({ summary: 'Fetch all SubCategory with paginate' })
    @ResponseMessage('Fetch all SubCategory with paginate')
    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.subcategoriesService.findAll(+currentPage, +limit, qs);
    }

    @ApiOperation({ summary: 'Fetch SubCategory by category id' })
    @ResponseMessage('Fetch SubCategory by category id')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subcategoriesService.findAllByCategoryId(id);
    }

    @ApiOperation({ summary: 'Update a SubCategory' })
    @ResponseMessage('Update a SubCategory')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSubcategoryDto: UpdateSubcategoryDto,
        @User() user: IUser,
    ) {
        return this.subcategoriesService.update(id, updateSubcategoryDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subcategoriesService.remove(+id);
    }
}
