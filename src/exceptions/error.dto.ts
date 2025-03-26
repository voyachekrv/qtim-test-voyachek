import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

/**
 * DTO для данных об HTTP-исключении
 */
export class ErrorDto {
  /**
   * HTTP-статус
   */
  @ApiProperty({ description: 'HTTP-статус', example: HttpStatus.NOT_FOUND })
  statusCode: number;

  /**
   * Сообщение об ошибке
   */
  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Пользователь с ID: `f91de2d5-64d7-4d3a-979e-795e5953153f` не найден'
  })
  message: string;

  /**
   * Описание полей, в которых содержится ошибка
   */
  @ApiProperty({
    description: 'Описание полей, в которых содержится ошибка',
    example: ['Имя пользователя не может быть пустым'],
    nullable: true,
    required: false
  })
  failedFields?: string[];

  /**
   * @param statusCode HTTP-статус
   * @param message Сообщение об ошибке
   * @param failedFields Описание полей, в которых содержится ошибка
   */
  constructor(statusCode: number, message: string, failedFields?: string[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.failedFields = failedFields;
  }

  /**
   * Создание DTO ошибки
   * @param statusCode HTTP-статус
   * @param message Сообщение об ошибке
   */
  public static of(statusCode: number, message: string): ErrorDto {
    return new ErrorDto(statusCode, message);
  }
}
