import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
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
    avatar: string;

    @ApiProperty({ required: false })
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    role: string;

    @ApiProperty()
    active?: boolean;

    @ApiProperty({ required: false })
    streetAddress?: string;

    @ApiProperty({ required: false })
    latitude?: number;

    @ApiProperty({ required: false })
    longitude?: number;

    @ApiProperty({ required: false })
    provinceCode?: string;

    @ApiProperty({ required: false })
    districtCode?: string;

    @ApiProperty({ required: false })
    wardCode?: string;

    @ApiProperty({ required: false })
    provinceName?: string;

    @ApiProperty({ required: false })
    districtName?: string;

    @ApiProperty({ required: false })
    wardName?: string;
}
