import { USER_USERNAME_LENGTH } from '../../entities';

/**
 * Ограничения, накладываемые на поля DTO для сущности "Пользователь"
 */
export class UserConstraints {
  /**
   * Имя пользователя (`username`) - минимальная длина
   */
  public static readonly USERNAME_MIN_LENGTH: number = 3;

  /**
   * Имя пользователя (`username`) - максимальная длина
   */
  public static readonly USERNAME_MAX_LENGTH: number = USER_USERNAME_LENGTH;
}
