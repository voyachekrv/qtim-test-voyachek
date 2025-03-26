import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataSourceParams } from '../utils/database';

/**
 * Конфигурация подключения TypeORM к БД
 */
export const databaseConfiguration = (config: ConfigService): TypeOrmModuleOptions => ({
  ...dataSourceParams(config),
  migrations: ['migrations/*-migration.js']
});
