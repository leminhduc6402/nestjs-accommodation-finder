import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import ms from 'ms';
import { JwtStrategy } from './passport/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { GoogleStrategy } from './passport/google.strategy';
import { SessionSerializer } from './serializers/serializer';
import { FacebookStrategy } from './passport/facebook.strategy';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from 'src/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
        MailModule,
        CacheModule.register(),
        PassportModule.register({ session: true }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
                signOptions: {
                    expiresIn:
                        ms(configService.get<string>('JWT_ACCESS_EXPIRE')) /
                        1000,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        SessionSerializer,
        FacebookStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
