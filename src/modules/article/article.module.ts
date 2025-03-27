import { Module } from '@nestjs/common';
import { ArticleController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities';
import { ArticleService } from './services';
import { UserEntity } from '../auth/entities';
import { ArticleMapper } from './mappers';

const INJECTED_ENTITIES = [ArticleEntity, UserEntity];
const INJECTED_MAPPERS = [ArticleMapper];
const INJECTED_SERVICES = [ArticleService];

/**
 * Модуль для работы со статьями
 */
@Module({
  imports: [TypeOrmModule.forFeature(INJECTED_ENTITIES)],
  providers: [...INJECTED_MAPPERS, ...INJECTED_SERVICES],
  controllers: [ArticleController]
})
export class ArticleModule {}
