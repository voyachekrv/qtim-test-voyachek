import { Injectable } from '@nestjs/common';
import { UserSignUpDto } from '../dto/user';
import { UserEntity } from '../entities';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

/**
 * Маппинг сущности "Пользователь"
 */
@Injectable()
export class UserMapper {
  constructor(private readonly config: ConfigService) {}

  /**
   * Преобразование DTO регистрации в сущность пользователя
   * @param dto Данные для регистрации пользователя
   */
  public async toEntity(dto: UserSignUpDto): Promise<UserEntity> {
    const entity = new UserEntity();
    entity.username = dto.username;
    entity.passwordHash = await bcrypt.hash(dto.password, this.config.getOrThrow<number>('security.user.salt-rounds'));

    return entity;
  }
}
