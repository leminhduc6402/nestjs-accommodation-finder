import { Module } from '@nestjs/common';
import { LandlordRequestService } from './landlord-request.service';
import { LandlordRequestController } from './landlord-request.controller';

@Module({
  controllers: [LandlordRequestController],
  providers: [LandlordRequestService],
})
export class LandlordRequestModule {}
