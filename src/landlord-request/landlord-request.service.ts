import { Injectable } from '@nestjs/common';
import { CreateLandlordRequestDto } from './dto/create-landlord-request.dto';
import { UpdateLandlordRequestDto } from './dto/update-landlord-request.dto';

@Injectable()
export class LandlordRequestService {
  create(createLandlordRequestDto: CreateLandlordRequestDto) {
    return 'This action adds a new landlordRequest';
  }

  findAll() {
    return `This action returns all landlordRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} landlordRequest`;
  }

  update(id: number, updateLandlordRequestDto: UpdateLandlordRequestDto) {
    return `This action updates a #${id} landlordRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} landlordRequest`;
  }
}
