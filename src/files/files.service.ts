import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { v4 as uuidv4 } from 'uuid';
import { File, FileDocument } from './schemas/file.schema';
import aqp from 'api-query-params';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(File.name)
        private fileModel: SoftDeleteModel<FileDocument>,
        private configService: ConfigService,
    ) {}
    private readonly s3Client = new S3Client({
        region: this.configService.get<string>('AWS_REGION'),
        credentials: {
            accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get<string>(
                'AWS_SECRET_ACCESS_KEY',
            ),
        },
    });

    async upload(file: Express.Multer.File, user: IUser) {
        const key = `${uuidv4()}-${file.originalname}`;
        const result = await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Key: key,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: file.mimetype,
            }),
        );
        if (result.$metadata.httpStatusCode !== 200) {
            throw new BadRequestException(
                'Something wrong when upload file!!!',
            );
        }

        const fileInfo = await this.fileModel.create({
            name: key,
            mimeType: file.mimetype,
            size: file.size,
            path: `https://${this.configService.get(
                'AWS_PUBLIC_BUCKET_NAME',
            )}.s3.amazonaws.com/${key}`,
            createdBy: user._id,
        });
        return { path: fileInfo.path };
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, population, projection } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.fileModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const results = await this.fileModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .select(projection)
            .populate(population)
            .exec();
        return {
            meta: {
                current: currentPage, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems, // tổng số phần tử (số bản ghi)
            },
            results, //kết quả query
        };
    }

    async remove(key: string, user: IUser) {
        if (!this.fileModel.findOne({ name: key }))
            throw new NotFoundException('Cannot found this file');

        const result = await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Key: key,
            }),
        );

        if (result.$metadata.httpStatusCode === 204) {
            this.fileModel.updateOne(
                { name: key },
                {
                    deletedBy: user._id,
                },
            );
        }
        return this.fileModel.softDelete({ name: key });
    }
}
// private getS3() {
//   return new S3({
//     region: this.configService.get<string>('AWS_REGION'),
//     credentials: {
//       accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
//       secretAccessKey: this.configService.get<string>(
//         'AWS_SECRET_ACCESS_KEY',
//       ),
//     },
//   });
// }

// async remove(key: string) {
//   const s3 = this.getS3();
//   const result = await s3.deleteObject({
//     Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
//     Key: key,
//   });
//   return result;
// }

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

// async upload(file: Express.Multer.File, @User() user: IUser) {
//   const s3 = this.getS3();
//   const uploadResult = await s3
//     .upload({
//       Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
//       Body: file.buffer,
//       Key: `${uuidv4()}-${file.originalname}`,
//       ACL: 'public-read' as ObjectCannedACL,
//     })
//     .promise();
//   if (!uploadResult) {
//     throw new BadRequestException('Something wrong when upload file');
//   }
//   const result = await this.fileModel.create({
//     name: uploadResult.Key,
//     mimeType: file.mimetype,
//     size: file.size,
//     key: uploadResult.Key,
//     path: uploadResult.Location,
//     createdBy: user._id,
//   });
//   return { path: result.path };
// }
