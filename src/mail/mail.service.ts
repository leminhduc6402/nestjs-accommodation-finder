import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import otpGenerator from 'otp-generator';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}
    async sendPasscode(receiver: string, template: string) {
        const passcode = await otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        });

        await this.cacheManager.set(receiver, passcode);
        
        await this.mailerService.sendMail({
            to: receiver,
            from: '"Support Team" <support@example.com>',
            subject: 'Welcome to Nice App! Confirm your Email',
            template: template,
            context: {
                passcode,
            },
        });
    }
    async getPasscode(email: string) {
        return await this.cacheManager.get(email);
    }
}
