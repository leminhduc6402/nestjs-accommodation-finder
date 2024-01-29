import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { ConfigService } from '@nestjs/config';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/customDecorator/customize';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class FilesService {
  // constructor(
  // @InjectModel(File.name)
  // private fileModel: SoftDeleteModel<FileDocument>,
  //   private configService: ConfigService,
  // ) {}

  private readonly s3Client: S3Client;

  constructor(
    @InjectModel(File.name)
    private fileModel: SoftDeleteModel<FileDocument>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  private getS3() {
    return new S3({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async upload(file: Express.Multer.File, @User() user: IUser) {
    const s3 = this.getS3();

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: file.buffer,
        Key: `${uuidv4()}-${file.originalname}`,
        ACL: 'public-read' as ObjectCannedACL,
      })
      .promise();
    if (!uploadResult) {
      throw new BadRequestException('Something wrong when upload file');
    }
    const result = await this.fileModel.create({
      name: uploadResult.Key,
      mimeType: file.mimetype,
      size: file.size,
      key: uploadResult.Key,
      path: uploadResult.Location,
      createdBy: user._id,
    });
    return { path: result.path };
  }
}

// findAll() {
//   return `This action returns all files`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} file`;
// }

// update(id: number, updateFileDto: UpdateFileDto) {
//   return `This action updates a #${id} file`;
// }

// remove(id: number) {
//   return `This action removes a #${id} file`;
// }
