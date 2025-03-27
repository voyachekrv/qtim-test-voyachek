import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ErrorDto } from '../error.dto';

/**
 * Обработчик ошибки 404
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: NotFoundException, host: ArgumentsHost): void {
    const status = HttpStatus.NOT_FOUND;

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(status).send(ErrorDto.of(status, exception.message));
  }
}
