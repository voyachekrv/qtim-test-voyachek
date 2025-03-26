import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UserConstraints } from './user.constraints';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Данные для авторизации пользователя
 */
export class UserSignInDto {
  /**
   * Имя пользователя
   */
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'john_doe',
    minLength: UserConstraints.USERNAME_MIN_LENGTH,
    maxLength: UserConstraints.USERNAME_MAX_LENGTH
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @Length(UserConstraints.USERNAME_MIN_LENGTH, UserConstraints.USERNAME_MAX_LENGTH, {
    message: `Длина имени пользователя должна составлять от ${UserConstraints.USERNAME_MIN_LENGTH} до ${UserConstraints.USERNAME_MAX_LENGTH} символов`
  })
  username: string;

  /**
   * Пароль
   */
  @ApiProperty({ description: 'Пароль', example: 'qwerty' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;
}
