import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services';
import { UserSignInDto, UserSignUpDto } from '../dto/user';
import { AccessTokenDto } from '../dto/token';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorDto } from '../../../exceptions';
import { NoAuth } from '../decorators';

@Controller('auth')
@NoAuth()
@ApiTags('AuthController - авторизация / регистрация пользователя')
@ApiResponse({ type: ErrorDto, description: 'Некорректные входные данные', status: HttpStatus.BAD_REQUEST })
@ApiResponse({ type: ErrorDto, description: 'Ошибка авторизации', status: HttpStatus.UNAUTHORIZED })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: UserSignUpDto, description: 'Данные для регистрации пользователя' })
  @ApiResponse({ type: AccessTokenDto, description: 'JWT-токен', status: HttpStatus.CREATED })
  public async signUp(@Body(new ValidationPipe({ transform: true })) dto: UserSignUpDto): Promise<AccessTokenDto> {
    return await this.authService.signUp(dto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: UserSignInDto, description: 'Данные для авторизации пользователя' })
  @ApiResponse({ type: AccessTokenDto, description: 'JWT-токен', status: HttpStatus.OK })
  public async signIn(@Body(new ValidationPipe({ transform: true })) dto: UserSignInDto): Promise<AccessTokenDto> {
    return await this.authService.signIn(dto);
  }
}
