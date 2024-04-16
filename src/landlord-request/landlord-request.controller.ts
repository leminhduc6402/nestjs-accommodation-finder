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
import { User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('landlord-request')
export class LandlordRequestController {
    constructor(
        private readonly landlordRequestService: LandlordRequestService,
    ) {}

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

    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.landlordRequestService.findAllByUserId(
            +currentPage,
            +limit,
            qs,
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.landlordRequestService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLandlordRequestDto: UpdateLandlordRequestDto,
    ) {
        return this.landlordRequestService.update(
            +id,
            updateLandlordRequestDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.landlordRequestService.remove(+id);
    }
}
