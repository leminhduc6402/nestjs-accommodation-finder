import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
    MulterModuleOptions,
    MulterOptionsFactory,
} from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = [
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                    'pdf',
                    'doc',
                    'docx',
                    'mp4',
                ];
                const fileExtension = file.originalname
                    .split('.')
                    .pop()
                    .toLowerCase();
                const isValidFileType =
                    allowedFileTypes.includes(fileExtension);
                if (!isValidFileType) {
                    cb(
                        new HttpException(
                            'Invalid file type',
                            HttpStatus.UNPROCESSABLE_ENTITY,
                        ),
                        null,
                    );
                } else cb(null, true);
            },
            limits: {
                fileSize: 1024 * 1024 * 1024 * 2, //2GB
            },
        };
    }
}
