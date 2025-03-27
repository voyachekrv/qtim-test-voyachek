import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayloadType } from '../dto/token';

const MESSAGE_UNAUTHORIZED = 'Пользователь не зарегистрирован';

/**
 * Декоратор для извлечения данных о пользователе (полезной нагрузки JWT-токена)
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AccessTokenPayloadType => {
  const request: Request = ctx.switchToHttp().getRequest();
  const user = request.user as Express.User;

  if (!request.user) {
    throw new UnauthorizedException(MESSAGE_UNAUTHORIZED);
  }

  return user['jwtPayload'] as AccessTokenPayloadType;
});
