import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../utils/entities';

/**
 * Поле "Имя пользователя" (`user.username`) - максимальная длина
 */
export const USER_USERNAME_LENGTH: number = 128;

/**
 * Сущность "Пользователь"
 */
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  /**
   * Имя пользователя
   */
  @Column({ name: 'username', length: USER_USERNAME_LENGTH })
  username: string;

  /**
   * Пароль
   */
  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;
}
