import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from './mappers';
import { AuthService } from './services';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfiguration } from '../../configurations';
import { AuthController } from './controllers';
import { UserEntity } from './entities';

const INJECTED_ENTITIES = [UserEntity];
const INJECTED_MAPPERS = [UserMapper];
const INJECTED_SERVICES = [AuthService];

/**
 * Модуль для работы с пользователями, их авторизацией и регистрацией
 */
@Module({
  imports: [
    TypeOrmModule.forFeature(INJECTED_ENTITIES),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfiguration
    })
  ],
  providers: [...INJECTED_MAPPERS, ...INJECTED_SERVICES],
  controllers: [AuthController]
})
export class UserModule {}
