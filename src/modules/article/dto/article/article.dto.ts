import { ArticleAuthorDto } from './article-author.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Данные для отображения статьи (полная версия)
 */
export class ArticleDto {
  /**
   * ID статьи
   */
  @ApiProperty({ description: 'ID статьи', example: '2c7dd105-7c7b-4aab-936f-3f59ca16dfb5' })
  id: string;

  /**
   * Дата создания
   */
  @ApiProperty({ description: 'Дата создания', example: new Date() })
  createdAt: Date;

  /**
   * Дата обновления
   */
  @ApiProperty({ description: 'Дата обновления', example: new Date() })
  updatedAt: Date;

  /**
   * Название статьи
   */
  @ApiProperty({ description: 'Название статьи', example: 'Название статьи' })
  name: string;

  /**
   * Описание статьи
   */
  @ApiProperty({
    description: 'Описание статьи',
    example: 'Lorem ipsum',
    type: String,
    required: false,
    nullable: true
  })
  description?: string | null;

  /**
   * Текст статьи
   */
  @ApiProperty({ description: 'Текст статьи', example: 'Lorem ipsum sit dolor amet...' })
  text: string;

  /**
   * Автор статьи
   */
  @ApiProperty({ description: 'Автор статьи', type: ArticleAuthorDto })
  author: ArticleAuthorDto;

  /**
   * @param id ID статьи
   * @param createdAt Дата создания
   * @param updatedAt Дата обновления
   * @param name Название статьи
   * @param text Текст статьи
   * @param author Автор статьи
   * @param description Описание статьи
   */
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    text: string,
    author: ArticleAuthorDto,
    description?: string | null
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.text = text;
    this.author = author;
    this.description = description ?? undefined;
  }
}
