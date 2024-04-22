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
import { LandlordRequestService } from './landlord-request.service';
import { CreateLandlordRequestDto } from './dto/create-landlord-request.dto';
import { UpdateLandlordRequestDto } from './dto/update-landlord-request.dto';
import { ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Landlord-request')
@Controller('landlord-request')
export class LandlordRequestController {
    constructor(
        private readonly landlordRequestService: LandlordRequestService,
    ) {}

    @ApiOperation({ summary: 'Create a request' })
    @ResponseMessage('Create a request')
    @Post()
    create(
        @Body() createLandlordRequestDto: CreateLandlordRequestDto,
        @User() user: IUser,
    ) {
        return this.landlordRequestService.create(
            createLandlordRequestDto,
            user,
        );
    }

    @ApiOperation({ summary: 'Fetch all request with paginate' })
    @ResponseMessage('Fetch all request with paginate')
    @ApiQuery({ name: 'createdBy', required: false })
    @ApiQuery({ name: 'populate', required: false })
    @ApiQuery({ name: 'fields', required: false })
    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.landlordRequestService.findAll(+currentPage, +limit, qs);
    }

    @ApiOperation({ summary: 'Get a request by id' })
    @ResponseMessage('Get a request by id')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.landlordRequestService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a request' })
    @ResponseMessage('Update a request')
    @Patch()
    update(@Body() updateLandlordRequestDto: UpdateLandlordRequestDto, @User() user: IUser) {
        return this.landlordRequestService.update(updateLandlordRequestDto, user);
    }
}
