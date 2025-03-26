import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';

/**
 * Базовый класс для создания сущности
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  /**
   * ID записи
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Дата создания записи
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Дата обновления записи
   */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
