import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Public, ResponseMessage } from 'src/customDecorator/customize';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/mail.dto';

@ApiTags('Mail')
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
    @ApiOperation({ summary: 'Test send mail' })
    @Get()
    async handleTestEmail() {
        await this.mailerService.sendMail({
            to: 'ducprotc456@gmail.com',
            from: '"Support Team" <support@example.com>',
            subject: 'Welcome to Nice App! Confirm your Email',
            template: 'new-article',
        });
    }

    @Public()
    @ResponseMessage('Send passcode via email')
    @ApiOperation({ summary: 'Send passcode' })
    @Post('send-passcode')
    async sendPasscode(@Body() sendMailDto: SendMailDto) {
        this.mailService.sendPasscode(sendMailDto, 'confirm-code');
        return true;
    }
}
