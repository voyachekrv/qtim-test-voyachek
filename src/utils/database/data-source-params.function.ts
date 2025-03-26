import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

/**
 * Параметры подключения к базе данных, извлекаемые из конфиг-файла
 */
export const dataSourceParams = (config: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  entities: [`${__dirname}/../../modules/**/entities/*.entity{.ts,.js}`],
  host: config.getOrThrow<string>('database.host'),
  port: config.getOrThrow<number>('database.port'),
  username: config.getOrThrow<string>('database.username'),
  password: config.getOrThrow<string>('database.password'),
  database: config.getOrThrow<string>('database.database'),
  schema: config.getOrThrow<string>('database.schema'),
  synchronize: config.getOrThrow<boolean>('database.synchronize'),
  migrationsRun: config.getOrThrow<boolean>('database.migrations-run'),
  logging: config.getOrThrow<boolean>('database.logging')
});
