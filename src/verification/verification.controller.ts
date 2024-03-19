import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
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

    @Get()
    findAll() {
        return this.verificationService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.verificationService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateVerificationDto: UpdateVerificationDto,
    ) {
        return this.verificationService.update(+id, updateVerificationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.verificationService.remove(+id);
    }
}
