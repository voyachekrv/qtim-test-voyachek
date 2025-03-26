import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initSwagger } from './utils/swagger';
import { BadRequestExceptionFilter, UnauthorizedExceptionFilter } from './exceptions';

const DEFAULT_APP_PORT: number = 3000;

let port: number;

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);

  port = config.getOrThrow<number>('http.port') ?? DEFAULT_APP_PORT;
  app.setGlobalPrefix(config.getOrThrow<string>('http.prefix'));

  initSwagger(app, config);

  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  await app.listen(port);
};

bootstrap().then(() => {
  Logger.log(`The application is running on port: ${port}`, 'main');
});
