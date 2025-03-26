import { ArgumentsHost, UnauthorizedException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ErrorDto } from '../error.dto';

/**
 * Обработчик ошибки 401
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  public catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const status = HttpStatus.UNAUTHORIZED;

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(status).send(ErrorDto.of(status, exception.message));
  }
}
