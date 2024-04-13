import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LandlordRequestService } from './landlord-request.service';
import { CreateLandlordRequestDto } from './dto/create-landlord-request.dto';
import { UpdateLandlordRequestDto } from './dto/update-landlord-request.dto';

@Controller('landlord-request')
export class LandlordRequestController {
  constructor(private readonly landlordRequestService: LandlordRequestService) {}

  @Post()
  create(@Body() createLandlordRequestDto: CreateLandlordRequestDto) {
    return this.landlordRequestService.create(createLandlordRequestDto);
  }

  @Get()
  findAll() {
    return this.landlordRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landlordRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLandlordRequestDto: UpdateLandlordRequestDto) {
    return this.landlordRequestService.update(+id, updateLandlordRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landlordRequestService.remove(+id);
  }
}
