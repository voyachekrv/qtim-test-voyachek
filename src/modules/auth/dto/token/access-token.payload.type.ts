/**
 * Полезная нагрузка JWT-токена
 */
export type AccessTokenPayloadType = {
  /**
   * ID пользователя
   */
  id: string;

  /**
   * Имя пользователя
   */
  username: string;
};
