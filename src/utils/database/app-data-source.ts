import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { dataSourceParams } from './data-source-params.function';
import { loadConfig } from '../config';
config();

const configService = new ConfigService(loadConfig());

/**
 * Подключение к базе данных вне контекста Nest.js
 */
const AppDataSource = new DataSource({ ...dataSourceParams(configService), migrations: ['migrations/*-migration.ts'] });

export default AppDataSource;
