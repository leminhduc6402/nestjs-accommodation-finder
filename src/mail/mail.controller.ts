import { Body, Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/customDecorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    @Public()
    @ResponseMessage('Test email')
    @Get()
    async handleTestEmail() {
        await this.mailerService.sendMail({
            to: '2051052028dat@ou.edu.vn',
            from: '"Support Team" <support@example.com>',
            subject: 'Welcome to Nice App! Confirm your Email',
            template: 'test',
        });
    }

    @Public()
    @Get('set-code')
    async setPasscode(@Body('email') email: string) {
        await this.cacheManager.set(email, '123456');
        return true;
    }

    @Public()
    @Get('get-code')
    async getPasscode(@Body('email') email: string) {
        return await this.cacheManager.get(email);
    }
}
