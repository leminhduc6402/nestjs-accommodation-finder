import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalDto } from './dto/create-statistical.dto';
import { UpdateStatisticalDto } from './dto/update-statistical.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    Public,
    ResponseMessage,
    SkipCheckPermission,
} from 'src/customDecorator/customize';

@ApiTags('Statistical')
@Controller('statistical')
export class StatisticalController {
    constructor(private readonly statisticalService: StatisticalService) {}

    @Post()
    create(@Body() statisticalDto: StatisticalDto) {
        return this.statisticalService.create(statisticalDto);
    }

    @SkipCheckPermission()
    @ApiOperation({ summary: 'Statistics all' })
    @ResponseMessage('Statistics all')
    @Get()
    findAll() {
        return this.statisticalService.findAll();
    }

    @SkipCheckPermission()
    @ApiOperation({ summary: 'Get user statistics' })
    @ResponseMessage('Get user statistics')
    @Get('users')
    getUserStatistics() {
        return this.statisticalService.getUserStatistics();
    }

    @SkipCheckPermission()
    @ApiOperation({ summary: 'Get article statistics' })
    @ResponseMessage('Get article statistics')
    @Get('articles')
    getArticleStatistics(@Body() statisticalDto: StatisticalDto) {
        return this.statisticalService.getArticleStatistics(statisticalDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.statisticalService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateStatisticalDto: UpdateStatisticalDto,
    ) {
        return this.statisticalService.update(+id, updateStatisticalDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.statisticalService.remove(+id);
    }
}
