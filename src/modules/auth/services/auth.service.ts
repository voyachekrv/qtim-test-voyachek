import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserMapper } from '../mappers';
import { UserEntity } from '../entities';
import { UserSignInDto, UserSignUpDto } from '../dto/user';
import { AccessTokenDto, AccessTokenPayloadType } from '../dto/token';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

const MESSAGE_USER_ALREADY_EXISTS = 'Пользователь с данным именем уже существует';
const MESSAGE_PASSWORDS_DONT_MATCH = 'Пароли не совпадают';
const MESSAGE_WRONG_USERNAME_OR_PASSWORD = 'Неверное имя пользователя или пароль';

/**
 * Сервис для авторизации и регистрации пользователей
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userMapper: UserMapper,
    private jwtService: JwtService
  ) {}

  /**
   * Авторизация пользователя
   * @param dto DTO авторизации пользователя
   */
  public async signIn(dto: UserSignInDto): Promise<AccessTokenDto> {
    const user = await this.validateUser(dto);

    const jwtPayload: AccessTokenPayloadType = { username: user.username, id: user.id };

    return new AccessTokenDto(this.jwtService.sign({ jwtPayload }));
  }

  /**
   * Регистрация нового пользователя
   * @param dto DTO регистрации пользователя
   */
  public async signUp(dto: UserSignUpDto): Promise<AccessTokenDto> {
    await this.checkUserBeforeCreation(dto);

    const newUser = await this.userMapper.toEntity(dto);

    const createdUser = await this.userRepository.save(newUser);

    return await this.signIn({ username: createdUser.username, password: dto.password });
  }

  /**
   * Поиск пользователя по его имени
   */
  private async findUserByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  /**
   * Проверка пользователя перед его добавлением
   */
  private async checkUserBeforeCreation(dto: UserSignUpDto): Promise<void> {
    if (dto.password !== dto.repeatPassword) {
      throw new BadRequestException(MESSAGE_PASSWORDS_DONT_MATCH);
    }

    const user = await this.findUserByUsername(dto.username);

    if (user) {
      throw new BadRequestException(MESSAGE_USER_ALREADY_EXISTS);
    }
  }

  /**
   * Проверка пользователя перед его авторизацией
   */
  private async validateUser(dto: UserSignInDto): Promise<UserEntity> {
    const user = await this.findUserByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException(MESSAGE_WRONG_USERNAME_OR_PASSWORD);
    }

    const isPasswordsMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordsMatch) {
      throw new UnauthorizedException(MESSAGE_WRONG_USERNAME_OR_PASSWORD);
    }

    return user;
  }
}
