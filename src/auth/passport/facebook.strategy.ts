import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID'),
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
            callbackURL: configService.get<string>('FACEBOOK_APP_CALLBACK_URL'),
            scope: ['email'],
            profileFields: ['emails', 'name', 'displayName', 'picture'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        const pictureUrl = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        const user = await this.authService.validateUserWithSocial(
            profile.emails[0].value,
            profile.displayName,
            pictureUrl,
        );
        return user;
    }
}
