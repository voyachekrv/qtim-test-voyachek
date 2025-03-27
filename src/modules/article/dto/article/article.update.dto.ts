import { ArticleConstraints } from './article.constraints';
import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Данные для обновления сущности "Статья"
 */
export class ArticleUpdateDto {
  /**
   * Название статьи
   */
  @ApiProperty({
    description: 'Название статьи',
    example: 'Название статьи',
    minLength: ArticleConstraints.NAME_MIN_LENGTH,
    maxLength: ArticleConstraints.NAME_MAX_LENGTH,
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'Название статьи должно быть строкой' })
  @Length(ArticleConstraints.NAME_MIN_LENGTH, ArticleConstraints.NAME_MAX_LENGTH, {
    message: `Название статьи должно быть длиной от ${ArticleConstraints.NAME_MIN_LENGTH} до ${ArticleConstraints.NAME_MAX_LENGTH}`
  })
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
  @IsOptional()
  @IsString({ message: 'Описание статьи должно быть строкой' })
  description: string | null;

  /**
   * Текст статьи
   */
  @ApiProperty({
    description: 'Текст статьи',
    example: 'Lorem ipsum sit dolor amet...',
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'Текст статьи должен быть строкой' })
  text: string;
}
