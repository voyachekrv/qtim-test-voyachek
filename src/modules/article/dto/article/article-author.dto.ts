import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для информации об авторе статьи
 */
export class ArticleAuthorDto {
  /**
   * ID автора
   */
  @ApiProperty({ description: 'ID автора', example: '2c7dd105-7c7b-4aab-936f-3f59ca16dfb5' })
  id: string;

  /**
   * Имя пользователя
   */
  @ApiProperty({ description: 'Имя пользователя', example: 'john_doe' })
  username: string;

  /**
   * @param id ID автора
   * @param username Имя пользователя
   */
  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }
}
