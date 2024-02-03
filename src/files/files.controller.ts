import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { FilesService } from './files.service';
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

  @ResponseMessage('Delete a file')
  @Delete(':name')
  remove(@Param('name') name: string, @User() user: IUser) {
    return this.filesService.remove(name, user);
  }
}
