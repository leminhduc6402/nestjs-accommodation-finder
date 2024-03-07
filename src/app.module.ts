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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
