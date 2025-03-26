import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import * as process from 'node:process';

/**
 * Инициализация Swagger-модуля
 * @param app Nest.js-приложение
 * @param config Сервис конфигурации
 */
export const initSwagger = (app: INestApplication, config: ConfigService): void => {
  const globalPath = config.getOrThrow<string>('http.prefix');
  const swaggerPath = config.getOrThrow<string>('swagger.path');

  const fullSwaggerPath = `${globalPath}/${swaggerPath}`;

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.getOrThrow<string>('swagger.title'))
    .setVersion(process.env.npm_package_version ?? '0.0.0')
    .addBearerAuth({ in: 'header', type: 'http', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(fullSwaggerPath, app, document);

  Logger.log(`Swagger is set up on: /${fullSwaggerPath}`, 'main');
};
