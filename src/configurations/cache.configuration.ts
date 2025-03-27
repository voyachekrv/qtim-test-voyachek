import { ConfigService } from '@nestjs/config';
import { CacheOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

/**
 * Конфигурация кэша (Redis)
 */
export const cacheConfiguration = (config: ConfigService): CacheOptions => ({
  stores: [
    createKeyv({
      url: `redis://${config.getOrThrow<string>('cache.host')}:${config.getOrThrow<number>('cache.port')}`,
      username: config.getOrThrow<string>('cache.username'),
      password: config.getOrThrow<string>('cache.password'),
      database: config.getOrThrow<number>('cache.database')
    })
  ]
});
