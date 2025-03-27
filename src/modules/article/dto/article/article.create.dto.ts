import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ArticleConstraints } from './article.constraints';
import { Transform } from 'class-transformer';

/**
 * Данные для создания сущности "Статья"
 */
export class ArticleCreateDto {
  /**
   * Название статьи
   */
  @ApiProperty({
    description: 'Название статьи',
    example: 'Название статьи',
    minLength: ArticleConstraints.NAME_MIN_LENGTH,
    maxLength: ArticleConstraints.NAME_MAX_LENGTH
  })
  @IsString({ message: 'Название статьи должно быть строкой' })
  @IsNotEmpty({ message: 'Название статьи не должно быть пустым' })
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
  @Transform(value => value.value ?? null)
  description: string | null;

  /**
   * Текст статьи
   */
  @ApiProperty({ description: 'Текст статьи', example: 'Lorem ipsum sit dolor amet...' })
  @IsString({ message: 'Текст статьи должен быть строкой' })
  @IsNotEmpty({ message: 'Текст статьи не должен быть пустым' })
  text: string;
}
