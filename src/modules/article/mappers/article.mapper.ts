import { Injectable } from '@nestjs/common';
import { ArticleAuthorDto, ArticleCreateDto, ArticleDto, ArticleShortDto, ArticleUpdateDto } from '../dto/article';
import { ArticleEntity } from '../entities';
import { UserEntity } from '../../auth/entities';

/**
 * Маппинг для сущности "Статья"
 */
@Injectable()
export class ArticleMapper {
  /**
   * Создание статьи на основе DTO
   * @param dto DTO создания статьи
   */
  public create(dto: ArticleCreateDto): ArticleEntity {
    const article = new ArticleEntity();
    article.name = dto.name;
    article.description = dto.description;
    article.text = dto.text;

    return article;
  }

  /**
   * Маппинг обновленных данных на сущность "Статья"
   * @param targetEntity Обновляемая статья
   * @param dto Данные для обновления статьи
   */
  public update(targetEntity: ArticleEntity, dto: ArticleUpdateDto): void {
    targetEntity.name = dto.name ?? targetEntity.name;
    targetEntity.description = dto.description ?? targetEntity.description;
    targetEntity.text = dto.text ?? targetEntity.text;
  }

  /**
   * Маппинг Статьи в полное DTO
   * @param entity сущность "Статья"
   */
  public toDto(entity: ArticleEntity): ArticleDto {
    const author = this.toAuthorDto(entity.author);

    return new ArticleDto(
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.name,
      entity.text,
      author,
      entity.description
    );
  }

  /**
   * Маппинг Статьи в сокращенное DTO
   * @param entity сущность "Статья"
   */
  public toShortDto(entity: ArticleEntity): ArticleShortDto {
    const author = this.toAuthorDto(entity.author);

    return new ArticleShortDto(entity.id, entity.createdAt, entity.name, entity.description, author);
  }

  /**
   * Маппинг сущности автора (пользователя) в DTO автора
   */
  private toAuthorDto(entity: UserEntity): ArticleAuthorDto {
    return new ArticleAuthorDto(entity.id, entity.username);
  }
}
