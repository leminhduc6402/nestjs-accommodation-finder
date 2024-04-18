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
import { VerificationService } from './verification.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Verifications')
@Controller('verifications')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) {}

    @ApiOperation({ summary: 'Create a verification' })
    @ResponseMessage('Create a verification')
    @Post()
    create(
        @Body() createVerificationDto: CreateVerificationDto,
        @User() user: IUser,
    ) {
        return this.verificationService.create(createVerificationDto, user);
    }

    @ApiOperation({ summary: 'Fetch all verification by article id' })
    @ResponseMessage('Fetch all verification by article id')
    @Get()
    async findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return await this.verificationService.findAllByArticleId(
            +currentPage,
            +limit,
            qs,
        );
    }

    @ApiOperation({ summary: 'Get verification by id' })
    @ResponseMessage('Fetch a verification by id')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.verificationService.findOne(id);
    }

    @ApiOperation({ summary: 'Update verification' })
    @ResponseMessage('Update a verification')
    @Patch()
    update(
        @Body() updateVerificationDto: UpdateVerificationDto,
        @User() user: IUser,
    ) {
        return this.verificationService.update(updateVerificationDto, user);
    }
}
