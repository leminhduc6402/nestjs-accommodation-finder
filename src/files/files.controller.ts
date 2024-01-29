import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUser } from 'src/users/users.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/single')
  @ResponseMessage('Upload single file')
  @UseInterceptors(FileInterceptor('fileUpload'))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return await this.filesService.upload(file, user);
  }

  // @Public()
  // @Post('upload/multiple')
  // @ResponseMessage('Upload single file')
  // @UseInterceptors(FileInterceptor('fileUpload'))
  // async uploadMultipleFiles(@UploadedFile() file: Express.Multer.File
  // // , @User() user: IUser
  // ) {
  //   return await this.filesService.create(file
  //     // , user
  //     );
  // }

  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
