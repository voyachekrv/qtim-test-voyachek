import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities';
import { Between, FindManyOptions, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ArticleCreateDto, ArticleDto, ArticleFilterDto, ArticleShortDto, ArticleUpdateDto } from '../dto/article';
import { AccessTokenPayloadType } from '../../auth/dto/token';
import { ArticleMapper } from '../mappers';
import { UserEntity } from '../../auth/entities';
import { Page } from '../../../utils/pagination';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

const MESSAGE_AUTHOR_WAS_NOT_FOUND = 'Автор не найден, ID: ';
const MESSAGE_ARTICLE_WAS_NOT_FOUND = 'Статья не найдена, ID: ';
const MESSAGE_NO_ACCESS_TO_ARTICLE = 'У вас нет доступа для выполнения операций с данной статьей';

/**
 * Сервис для работы со статьями
 */
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly articleMapper: ArticleMapper,
    private readonly config: ConfigService
  ) {}

  /**
   * Постраничный поиск множества статей по заданным параметрам
   * @param filter Условия фильтрации статей + пагинация
   */
  public async findMany(filter: ArticleFilterDto): Promise<Page<ArticleShortDto>> {
    const findManyOptions = this.makeFindManyOptions(filter);

    const entities = await Page.findAndPaginate(this.articleRepository, findManyOptions, filter);

    return entities.map(entity => this.articleMapper.toShortDto(entity));
  }

  /**
   * Поиск статьи по ее ID.
   * Извлекает статью из кэша, если в кэше статья отсутствует, то ищет ее в базе данных.
   * @param id Идентификатор статьи
   */
  public async findById(id: string): Promise<ArticleDto> {
    const cached = await this.cacheManager.get<ArticleDto>(this.toCacheKey(id));

    if (cached) {
      return cached;
    }

    const entity = await this.articleRepository.findOne({ where: { id }, relations: ['author'] });

    if (!entity) {
      throw new NotFoundException(`${MESSAGE_ARTICLE_WAS_NOT_FOUND}${id}`);
    }

    const foundArticle = this.articleMapper.toDto(entity);
    await this.cacheManager.set(
      this.toCacheKey(foundArticle.id),
      foundArticle,
      this.config.getOrThrow<number>('cache.ttl')
    );

    return foundArticle;
  }

  /**
   * Добавление новой статьи
   * @param dto DTO для создания статьи
   * @param user Данные о пользователе (Полезная нагрузка JWT-токена)
   */
  public async create(dto: ArticleCreateDto, user: AccessTokenPayloadType): Promise<ArticleDto> {
    const author = await this.findAuthor(user.id);

    const newArticle = this.articleMapper.create(dto);
    newArticle.author = author;

    const createdArticle = await this.articleRepository.save(newArticle);
    const createdArticleDto = this.articleMapper.toDto(createdArticle);

    await this.cacheManager.set(
      this.toCacheKey(createdArticleDto.id),
      createdArticleDto,
      this.config.getOrThrow<number>('cache.ttl')
    );

    return createdArticleDto;
  }

  /**
   * Обновление статьи
   * @param dto DTO для обновления статьи
   * @param id ID статьи
   * @param userId ID автора статьи
   */
  public async update(dto: ArticleUpdateDto, id: string, userId: string): Promise<ArticleDto> {
    const article = await this.findArticleByIdAndUserId(id, userId);

    this.articleMapper.update(article, dto);

    const updatedArticle = await this.articleRepository.save(article);
    const updatedArticleDto = this.articleMapper.toDto(updatedArticle);

    await this.cacheManager.set(
      this.toCacheKey(updatedArticleDto.id),
      updatedArticleDto,
      this.config.getOrThrow<number>('cache.ttl')
    );

    return updatedArticleDto;
  }

  /**
   * Удаление статьи
   * @param id ID статьи
   * @param userId ID автора статьи
   */
  public async remove(id: string, userId: string): Promise<void> {
    const entity = await this.findArticleByIdAndUserId(id, userId);

    await this.cacheManager.del(this.toCacheKey(id));
    await this.articleRepository.remove(entity);
  }

  /**
   * Преобразование входящего DTO фильтрации в условия поиска в TypeORM
   */
  private makeFindManyOptions(filter: ArticleFilterDto): FindManyOptions<ArticleEntity> {
    const where: FindOptionsWhere<ArticleEntity> = {};

    if (filter.username) {
      where.author = { username: filter.username };
    }

    if (filter.createdAt) {
      const { start, end } = filter.createdAt;
      if (start && end) {
        where.createdAt = Between(new Date(Date.parse(start)), new Date(Date.parse(end)));
      } else if (start) {
        where.createdAt = MoreThanOrEqual(new Date(Date.parse(start)));
      } else if (end) {
        where.createdAt = LessThanOrEqual(new Date(Date.parse(end)));
      }
    }

    return {
      where,
      relations: ['author'],
      order: { createdAt: 'desc' }
    };
  }

  /**
   * Генерация ключа для кэширования статьи
   */
  private toCacheKey(id: string): string {
    const keyPrefix = 'article';

    return `${keyPrefix}-${id}`;
  }

  /**
   * Поиск сущности типа "Статья" по ее собственному идентификатору и идентификатору ее автора
   */
  private async findArticleByIdAndUserId(id: string, userId: string): Promise<ArticleEntity> {
    const entity = await this.articleRepository.findOne({
      where: { id },
      relations: ['author']
    });

    if (!entity) {
      throw new NotFoundException(`${MESSAGE_ARTICLE_WAS_NOT_FOUND}${id}`);
    }

    if (entity.author.id !== userId) {
      throw new ForbiddenException(MESSAGE_NO_ACCESS_TO_ARTICLE);
    }

    return entity;
  }

  /**
   * Поиск пользователя по его ID
   */
  private async findAuthor(id: string): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`${MESSAGE_AUTHOR_WAS_NOT_FOUND}${id}`);
    }

    return entity;
  }
}
