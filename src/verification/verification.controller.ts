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
import { Public, User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Verifications')
@Controller('verifications')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) {}

    @Post()
    create(
        @Body() createVerificationDto: CreateVerificationDto,
        @User() user: IUser,
    ) {
        return this.verificationService.create(createVerificationDto, user);
    }

    @Get(':id')
    async findAll(
        @Param('id') id: string,
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return await this.verificationService.findAllByArticleId(
            id,
            +currentPage,
            +limit,
            qs,
        );
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.verificationService.findOne(id);
    }

    @Patch()
    update(
        @Body('id') id: string,
        @Body('status') status: string,
        @User() user: IUser,
    ) {
        return this.verificationService.update(id, status, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.verificationService.remove(+id);
    }
}
