import { ApiProperty } from '@nestjs/swagger';
import { PageRequestDto } from '../../../../utils/pagination';
import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Поиск по диапазону дат
 */
class DateTimeFilter {
  /**
   * Начало диапазона поиска
   */
  @ApiProperty({ description: 'Начало диапазона поиска по дате', example: '2025-03-01', required: false })
  @IsOptional()
  @IsString({ message: 'Начало поиска по дате должно быть строкой' })
  @IsDateString(undefined, { message: 'Начало поиска по дате должно иметь формат YYYY-MM-DD' })
  start?: string;

  /**
   * Конец диапазона поиска
   */
  @ApiProperty({ description: 'Конец диапазона поиска по дате', example: '2025-03-31', required: false })
  @IsOptional()
  @IsString({ message: 'Конец поиска по дате должен быть строкой' })
  @IsDateString(undefined, { message: 'Конец поиска по дате должен иметь формат YYYY-MM-DD' })
  end?: string;
}

/**
 * DTO для поиска и фильтрации записей о статьях
 */
export class ArticleFilterDto extends PageRequestDto {
  /**
   * Имя пользователя
   */
  @ApiProperty({ description: 'Фильтрация по имени пользователя', example: 'john_doe', required: false })
  @IsOptional()
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  username?: string;

  /**
   * Фильтрация по диапазону дат
   */
  @ApiProperty({ type: DateTimeFilter, description: 'Фильтрация по диапазону дат', required: false })
  @IsOptional()
  @ValidateNested({ message: 'Неверный тип поля `createdAt`' })
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter;
}
