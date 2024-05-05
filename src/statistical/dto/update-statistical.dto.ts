import { PartialType } from '@nestjs/swagger';
import { StatisticalDto } from './create-statistical.dto';

export class UpdateStatisticalDto extends PartialType(StatisticalDto) {}
