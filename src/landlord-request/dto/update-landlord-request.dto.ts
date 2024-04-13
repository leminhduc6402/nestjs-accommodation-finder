import { PartialType } from '@nestjs/swagger';
import { CreateLandlordRequestDto } from './create-landlord-request.dto';

export class UpdateLandlordRequestDto extends PartialType(CreateLandlordRequestDto) {}
