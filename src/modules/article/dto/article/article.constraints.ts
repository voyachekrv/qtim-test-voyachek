import { ARTICLE_NAME_MAX_LENGTH } from '../../entities';

/**
 * Ограничения, накладываемые на поля DTO для сущности "Статья"
 */
export class ArticleConstraints {
  /**
   * Название статьи (`name`) - минимальная длина
   */
  public static readonly NAME_MIN_LENGTH: number = 3;

  /**
   * Название статьи (`name`) - максимальная длина
   */
  public static readonly NAME_MAX_LENGTH: number = ARTICLE_NAME_MAX_LENGTH;
}
