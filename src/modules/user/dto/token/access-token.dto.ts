import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для передачи JWT-токена
 */
export class AccessTokenDto {
  /**
   * JWT-токен
   */
  @ApiProperty({
    description: 'JWT-токен',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIiLCJuYW1lIjoiIiwiaWF0IjowfQ.CeaEcCn9LyXMeEqMD9OZYgtc5Jgam8eDN4'
  })
  token: string;

  /**
   * @param token JWT-токен
   */
  constructor(token: string) {
    this.token = token;
  }
}
