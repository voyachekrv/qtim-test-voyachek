import { ApiProperty } from '@nestjs/swagger';
import { PageRequestDto } from './page-request.dto';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

/**
 * Страница списка объектов, запрошенных через TypeORM
 */
export class Page<T> {
  /**
   * Список объектов на странице
   */
  @ApiProperty({ description: 'Список объектов на странице', isArray: true })
  data: T[];

  /**
   * Общее число объектов в базе
   */
  @ApiProperty({ description: 'Общее число объектов в базе' })
  total: number;

  /**
   * Номер страницы
   */
  @ApiProperty({ description: 'Номер страницы' })
  page: number;

  /**
   * Количество записей на странице (максимальное)
   */
  @ApiProperty({ description: 'Количество записей на странице (максимальное)' })
  limit: number;

  /**
   * Общее количество страниц
   */
  @ApiProperty({ description: 'Общее количество страниц' })
  totalPages: number;

  constructor(data: T[], total: number, page: number, limit: number, totalPages: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }

  /**
   * Запрос к репозиторию и получение из него списка значений, обернутого в страницу
   * @param repository Репозиторий для запрашиваемой сущности
   * @param findManyOptions Параметры поиска для сущности
   * @param pageRequest Запрос на получение страницы
   */
  public static async findAndPaginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    findManyOptions: FindManyOptions<T>,
    pageRequest: PageRequestDto
  ): Promise<Page<T>> {
    const paginatedOptions = {
      ...findManyOptions,
      take: pageRequest.limit,
      skip: (pageRequest.page - 1) * pageRequest.limit
    };

    const [entities, total] = await repository.findAndCount(paginatedOptions);

    return new Page<T>(entities, total, pageRequest.page, pageRequest.limit, Math.ceil(total / pageRequest.limit));
  }

  /**
   * Маппинг объектов, содержащихся на странице в другой тип
   * @param mapper Функция, реализующая маппинг типов
   */
  public map<D>(mapper: (entity: T) => D): Page<D> {
    const mappedPage = new Page<D>([], this.total, this.page, this.limit, this.totalPages);
    mappedPage.data = this.data.map(mapper);

    return mappedPage;
  }
}
