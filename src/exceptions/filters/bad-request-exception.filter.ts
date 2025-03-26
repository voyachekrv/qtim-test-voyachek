import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ErrorDto } from '../error.dto';

/**
 * Обработчик ошибки 400
 */
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  public catch(exception: BadRequestException, host: ArgumentsHost): void {
    const status = HttpStatus.BAD_REQUEST;

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const errorDto = ErrorDto.of(status, exception.message);
    errorDto.failedFields = exception.getResponse()['message'];

    response.status(status).send(errorDto);
  }
}
