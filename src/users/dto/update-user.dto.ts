import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'The _id field cannot be empty' })
    _id: string;

    @ApiProperty()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ required: false })
    @IsOptional()
    avatar: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    role: string;

    @ApiProperty()
    active?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    streetAddress?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    latitude?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    longitude?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    provinceCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    districtCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    wardCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    provinceName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    districtName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    wardName?: string;
}
