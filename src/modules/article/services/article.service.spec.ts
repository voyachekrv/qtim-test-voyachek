import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ArticleEntity } from '../entities';
import { ArticleService } from './article.service';
import { UserEntity } from '../../auth/entities';
import { ArticleMapper } from '../mappers';
import { ArticleCreateDto, ArticleDto, ArticleFilterDto, ArticleShortDto, ArticleUpdateDto } from '../dto/article';
import { ConfigService } from '@nestjs/config';
import { Page } from '../../../utils/pagination';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: Repository<ArticleEntity>;
  let userRepository: Repository<UserEntity>;
  let cacheManager: Cache;
  let articleMapper: ArticleMapper;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn()
          }
        },
        {
          provide: ArticleMapper,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            toDto: jest.fn(),
            toShortDto: jest.fn().mockImplementation(
              (entity: ArticleEntity): ArticleShortDto => ({
                id: entity.id,
                name: entity.name,
                createdAt: entity.createdAt,
                author: entity.author
              })
            )
          }
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<Repository<ArticleEntity>>(getRepositoryToken(ArticleEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    articleMapper = module.get<ArticleMapper>(ArticleMapper);
    config = module.get<ConfigService>(ConfigService);
  });

  describe('findMany', () => {
    it('should return page of ArticleShortDto', async () => {
      const filter: ArticleFilterDto = { username: 'testUser', page: 1, limit: 10 };

      const articleEntities: ArticleEntity[] = [
        {
          id: '1',
          name: 'Статья 1',
          createdAt: new Date(),
          author: { id: 'u1', username: 'testUser' } as UserEntity
        } as ArticleEntity,
        {
          id: '2',
          name: 'Статья 2',
          createdAt: new Date(),
          author: { id: 'u1', username: 'testUser' } as UserEntity
        } as ArticleEntity
      ];

      const page = new Page(articleEntities, articleEntities.length, 1, 10, 1);

      const findAndPaginateSpy = jest.spyOn(Page, 'findAndPaginate').mockResolvedValue(page);

      const result = await service.findMany(filter);

      expect(result).toEqual(page);
      expect(findAndPaginateSpy).toHaveBeenCalledWith(articleRepository, expect.any(Object), filter);
      expect(articleMapper.toShortDto).toHaveBeenCalledTimes(articleEntities.length);
    });
  });

  describe('findById', () => {
    it('should return article from cache if exists', async () => {
      const articleId = 'article123';
      const cachedArticle = { id: articleId, title: 'Cached Article' };

      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedArticle);

      const result = await service.findById(articleId);
      expect(result).toEqual(cachedArticle);
      expect(cacheManager.get).toHaveBeenCalledWith(expect.stringContaining('article-'));
    });

    it('should return article from repository if not in cache', async () => {
      const articleId = 'article123';
      const articleEntity = { id: articleId, name: 'Database Article', author: {} } as ArticleEntity;
      const articleDto = { id: articleId, name: 'Database Article', author: {} } as ArticleDto;

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(articleEntity);
      jest.spyOn(articleMapper, 'toDto').mockReturnValue(articleDto);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);
      jest.spyOn(config, 'getOrThrow').mockReturnValue(6000);

      const result = await service.findById(articleId);
      expect(result).toEqual(articleEntity);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
      expect(cacheManager.set).toHaveBeenCalledWith(expect.stringContaining('article-'), articleDto, 6000);
    });

    it('should throw NotFoundException if article is not found', async () => {
      const articleId = 'article123';

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(articleId)).rejects.toThrow(NotFoundException);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
    });
  });

  describe('create', () => {
    it('should create an article successfully', async () => {
      const dto: ArticleCreateDto = { name: 'Test Title', text: 'Test Content', description: null };
      const user = { id: 'user123', username: 'test_user' };
      const authorEntity = { id: 'user123' } as UserEntity;
      const articleEntity = { id: 'article123', author: authorEntity } as ArticleEntity;
      const articleDto = { id: 'article123', name: 'Test Title', text: 'Test Content' } as ArticleDto;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(authorEntity);
      jest.spyOn(articleMapper, 'create').mockReturnValue(articleEntity);
      jest.spyOn(articleRepository, 'save').mockResolvedValue(articleEntity);
      jest.spyOn(articleMapper, 'toDto').mockReturnValue(articleDto);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);
      jest.spyOn(config, 'getOrThrow').mockReturnValue(6000);

      const result = await service.create(dto, user);
      expect(result).toEqual(articleDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(articleMapper.create).toHaveBeenCalledWith(dto);
      expect(articleRepository.save).toHaveBeenCalledWith(articleEntity);
      expect(articleMapper.toDto).toHaveBeenCalledWith(articleEntity);
      expect(cacheManager.set).toHaveBeenCalledWith(expect.stringContaining('article-'), articleDto, 6000);
    });

    it('should throw NotFoundException if author is not found', async () => {
      const dto: ArticleCreateDto = { name: 'Test Title', text: 'Test Content', description: null };
      const user = { id: 'user123', username: 'test_user' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(dto, user)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    });
  });

  describe('update', () => {
    it('should update an article successfully', async () => {
      const dto: ArticleUpdateDto = { name: 'Updated Title', text: 'Updated Content', description: null };
      const userId = 'user123';
      const articleId = 'article123';
      const authorEntity = { id: userId } as UserEntity;
      const articleEntity = { id: articleId, author: authorEntity } as ArticleEntity;
      const updatedArticleEntity = { ...articleEntity, ...dto } as ArticleEntity;
      const updatedArticleDto = { id: articleId, name: 'Updated Title', text: 'Updated Content' } as ArticleDto;

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(articleEntity);
      jest.spyOn(articleMapper, 'update').mockImplementation((article, updateDto) => Object.assign(article, updateDto));
      jest.spyOn(articleRepository, 'save').mockResolvedValue(updatedArticleEntity);
      jest.spyOn(articleMapper, 'toDto').mockReturnValue(updatedArticleDto);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);
      jest.spyOn(config, 'getOrThrow').mockReturnValue(6000);

      const result = await service.update(dto, articleId, userId);
      expect(result).toEqual(updatedArticleDto);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
      expect(articleMapper.update).toHaveBeenCalledWith(articleEntity, dto);
      expect(articleRepository.save).toHaveBeenCalledWith(articleEntity);
      expect(articleMapper.toDto).toHaveBeenCalledWith(updatedArticleEntity);
      expect(cacheManager.set).toHaveBeenCalledWith(expect.stringContaining('article-'), updatedArticleDto, 6000);
    });

    it('should throw NotFoundException if article is not found', async () => {
      const dto: ArticleUpdateDto = { name: 'Updated Title', text: 'Updated Content', description: null };
      const userId = 'user123';
      const articleId = 'article123';

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(dto, articleId, userId)).rejects.toThrow(NotFoundException);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const dto: ArticleUpdateDto = { name: 'Updated Title', text: 'Updated Content', description: null };
      const userId = 'user123';
      const articleId = 'article123';
      const anotherUser = { id: 'user456' } as UserEntity;
      const articleEntity = { id: articleId, author: anotherUser } as ArticleEntity;

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(articleEntity);

      await expect(service.update(dto, articleId, userId)).rejects.toThrow(ForbiddenException);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
    });
  });

  describe('remove', () => {
    it('should remove an article successfully', async () => {
      const userId = 'user123';
      const articleId = 'article123';
      const authorEntity = { id: userId } as UserEntity;
      const articleEntity = { id: articleId, author: authorEntity } as ArticleEntity;

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(articleEntity);
      jest.spyOn(articleRepository, 'remove').mockResolvedValue(articleEntity);
      jest.spyOn(cacheManager, 'del').mockResolvedValue(true);

      await service.remove(articleId, userId);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
      expect(articleRepository.remove).toHaveBeenCalledWith(articleEntity);
      expect(cacheManager.del).toHaveBeenCalledWith(expect.stringContaining('article-'));
    });

    it('should throw NotFoundException if article is not found', async () => {
      const userId = 'user123';
      const articleId = 'article123';

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(articleId, userId)).rejects.toThrow(NotFoundException);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const userId = 'user123';
      const articleId = 'article123';
      const anotherUser = { id: 'user456' } as UserEntity;
      const articleEntity = { id: articleId, author: anotherUser } as ArticleEntity;

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(articleEntity);

      await expect(service.remove(articleId, userId)).rejects.toThrow(ForbiddenException);
      expect(articleRepository.findOne).toHaveBeenCalledWith({ where: { id: articleId }, relations: ['author'] });
    });
  });
});
