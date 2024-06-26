import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { ArticlesModule } from './articles/articles.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { FollowModule } from './follow/follow.module';
import { MailModule } from './mail/mail.module';
import { VerificationModule } from './verification/verification.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LandlordRequestModule } from './landlord-request/landlord-request.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './databases/databases.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticalModule } from './statistical/statistical.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_CONNECTION_STRING'),
                connectionFactory: (connection: any) => {
                    connection.plugin(softDeletePlugin);
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        AuthModule,
        ArticlesModule,
        FilesModule,
        CategoriesModule,
        CommentsModule,
        FollowModule,
        MailModule,
        VerificationModule,
        LandlordRequestModule,
        PermissionsModule,
        RolesModule,
        DatabasesModule,
        StatisticalModule,
        SubcategoriesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
