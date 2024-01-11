import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, '..', 'public')); // access js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // view
  app.setViewEngine('ejs');

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
