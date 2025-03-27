import { SetMetadata } from '@nestjs/common';

/**
 * Декоратор для разрешения доступа к контроллеру без авторизации
 */
export const NoAuth = () => SetMetadata('noAuth', true);
