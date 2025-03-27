import { ApiProperty } from '@nestjs/swagger';
import { ArticleAuthorDto } from './article-author.dto';

/**
 * Данные для отображения статьи (сокращенная версия)
 */
export class ArticleShortDto {
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
   * Автор статьи
   */
  @ApiProperty({ description: 'Автор статьи', type: ArticleAuthorDto })
  author: ArticleAuthorDto;

  constructor(id: string, createdAt: Date, name: string, description: string | null, author: ArticleAuthorDto) {
    this.id = id;
    this.createdAt = createdAt;
    this.name = name;
    this.description = description ?? undefined;
    this.author = author;
  }
}
