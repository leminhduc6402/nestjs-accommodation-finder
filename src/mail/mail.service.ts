import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import otpGenerator from 'otp-generator';
import { SendMailDto, SendNewArticleDto } from './dto/mail.dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}
    async sendPasscode(sendMailDto: SendMailDto, template: string) {
        const { email } = sendMailDto;
        const passcode = await otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        });

        await this.cacheManager.set(email, passcode);

        await this.mailerService.sendMail({
            to: email,
            from: '"Support Team" <support@example.com>',
            subject: 'Welcome to Nice App! Confirm your Email',
            template: template,
            context: {
                passcode,
            },
        });
    }
    async getPasscode(email: string) {
        const passcode = await this.cacheManager.get(email);
        if (!passcode) {
            throw new NotFoundException();
        }
        return passcode;
    }

    async sendNewArticleEmail(sendNewArticleDto: SendNewArticleDto) {
        const { article, email } = sendNewArticleDto;
        await this.mailerService.sendMail({
            to: email,
            from: '"Support Team" <support@example.com>',
            subject: `${article.createdBy.email} has posted a new article`,
            template: 'new-article',
            context: {
                images: article.images[0],
                title: article.title,
                districtName: article.address.districtName,
                provinceName: article.address.provinceName,
                price: article.price,
                category: article.categoryId?.name + '',
                quantity: article.quantity,
                postedBy: article.createdBy?.fullName + '',
                phone: article.createdBy?.phone + '',
                id: article._id + '',
            },
        });
    }
}
