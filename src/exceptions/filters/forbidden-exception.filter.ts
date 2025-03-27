import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ErrorDto } from '../error.dto';

/**
 * Обработчик ошибки 403
 */
@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  public catch(exception: ForbiddenException, host: ArgumentsHost): void {
    const status = HttpStatus.FORBIDDEN;

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(status).send(ErrorDto.of(status, exception.message));
  }
}
