import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayloadType } from '../dto/token';

/**
 * Стратегия аутентификации через JWT для Passport.js
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('security.jwt.secret')
    });
  }

  public validate(payload: AccessTokenPayloadType): AccessTokenPayloadType {
    return payload;
  }
}
