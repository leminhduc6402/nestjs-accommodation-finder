import { Module } from '@nestjs/common';
import { LandlordRequestService } from './landlord-request.service';
import { LandlordRequestController } from './landlord-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LandlordRequest, LandlordRequestSchema } from './schemas/landlord-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LandlordRequest.name, schema: LandlordRequestSchema }]),
  ],
  controllers: [LandlordRequestController],
  providers: [LandlordRequestService],
})
export class LandlordRequestModule {}
