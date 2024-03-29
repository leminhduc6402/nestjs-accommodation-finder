import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import otpGenerator from 'otp-generator';
import { SendMailDto } from './dto/mail.dto';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}
    async sendPasscode(sendMailDto: SendMailDto, template: string) {
        try {
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
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getPasscode(email: string) {
        try {
            const passcode = await this.cacheManager.get(email);
            if (!passcode) {
                throw new NotFoundException();
            }
            return passcode;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
