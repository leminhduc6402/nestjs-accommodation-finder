import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './core/transform.interceptor';
import session from 'express-session';
import passport from 'passport';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    app.useStaticAssets(join(__dirname, '..', 'public')); // access js, css, images
    app.setBaseViewsDir(join(__dirname, '..', 'views')); // view
    app.setViewEngine('ejs');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    //config CORS (Cross-Origin Resource Sharing)
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Set-Cookie',
            'Cookie',
            'x-no-retry',
        ],
    });

    //config cookies
    app.use(cookieParser());

    // config versioning -- apis version
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
    });

    //Config express session
    app.use(
        session({
            secret: 'ahsdiahiwhkjaalahfwhoiawieouqiokajsfaslkjhfdaskjd',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 60000 * 60,
                sameSite: 'none',
                secure: true,
            },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Config Swagger
    const config = new DocumentBuilder()
        .setTitle('NestJS APIs Document')
        .setDescription('All Modules APIs')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'Bearer',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'token',
        )
        .addSecurityRequirements('token')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(configService.get<string>('PORT'));
}
bootstrap();
