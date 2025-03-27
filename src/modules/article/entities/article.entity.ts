import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../utils/entities';
import { UserEntity } from '../../auth/entities';

export const ARTICLE_NAME_MAX_LENGTH = 512;

/**
 * Сущность "Статья"
 */
@Entity({ name: 'article' })
export class ArticleEntity extends BaseEntity {
  /**
   * Название статьи
   */
  @Column({ name: 'name', length: ARTICLE_NAME_MAX_LENGTH })
  name: string;

  /**
   * Описание
   */
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  /**
   * Текст
   */
  @Column({ name: 'text', type: 'text' })
  text: string;

  /**
   * Автор статьи
   */
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  author: UserEntity;
}
