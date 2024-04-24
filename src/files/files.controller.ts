import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { FilesService } from './files.service';
import { IUser } from 'src/users/users.interface';
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @ApiOperation({ summary: 'Upload single file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ResponseMessage('Upload single file')
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingleFile(
        @UploadedFile() file: Express.Multer.File,
        @User() user: IUser,
    ) {
        return await this.filesService.upload(file, user);
    }

    @ApiOperation({ summary: 'Get all article with pagination' })
    @ResponseMessage('fetch article with pagination')
    @Get()
    findAll(
        @Query('current') currentPage: string,
        @Query('pageSize') limit: string,
        @Query() qs: string,
    ) {
        return this.filesService.findAll(+currentPage, +limit, qs);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.filesService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    //   return this.filesService.update(+id, updateFileDto);
    // }

    @ApiOperation({ summary: 'Remove a file' })
    @ResponseMessage('Remove a file')
    @Delete(':name')
    remove(@Param('name') name: string, @User() user: IUser) {
        return this.filesService.remove(name, user);
    }
}
