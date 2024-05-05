import { IsEnum, IsNotEmpty } from 'class-validator';
import { statisticalTypeEnum } from 'src/enum/enum';

export class StatisticalDto {
    @IsNotEmpty()
    fromDate: Date;

    @IsNotEmpty()
    toDate: Date;

    @IsNotEmpty()
    @IsEnum(statisticalTypeEnum)
    type: statisticalTypeEnum;
}
