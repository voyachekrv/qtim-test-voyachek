import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Конфигурация JWT
 */
export const jwtConfiguration = (config: ConfigService): JwtModuleOptions => ({
  secret: config.getOrThrow<string>('security.jwt.secret'),
  signOptions: { expiresIn: config.getOrThrow<string>('security.jwt.expires-in') }
});
