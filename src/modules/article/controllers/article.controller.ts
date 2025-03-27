import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, NoAuth } from '../../auth/decorators';
import { AccessTokenPayloadType } from '../../auth/dto/token';
import { ArticleCreateDto, ArticleDto, ArticleFilterDto, ArticleShortDto, ArticleUpdateDto } from '../dto/article';
import { ArticleService } from '../services';
import { ErrorDto } from '../../../exceptions';
import { Page } from '../../../utils/pagination';

@Controller('article')
@ApiTags('ArticleController - Работа со статьями')
@ApiResponse({ type: ErrorDto, description: 'Некорректные входные данные', status: HttpStatus.BAD_REQUEST })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':id')
  @NoAuth()
  @ApiOperation({ summary: 'Поиск статьи по ее ID' })
  @ApiResponse({ type: ArticleDto, description: 'Статья', status: HttpStatus.OK })
  @ApiResponse({ type: ErrorDto, description: 'Не найдено', status: HttpStatus.NOT_FOUND })
  public async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ArticleDto> {
    return await this.articleService.findById(id);
  }

  @Post()
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Поиск статей по заданным параметрам' })
  @ApiBody({ type: ArticleFilterDto, description: 'Данные для поиска статьи' })
  @ApiResponse({ type: Page<ArticleShortDto>, description: 'Статья', status: HttpStatus.OK })
  public async findMany(
    @Body(new ValidationPipe({ transform: true })) dto: ArticleFilterDto
  ): Promise<Page<ArticleShortDto>> {
    return await this.articleService.findMany(dto);
  }

  @Post('new')
  @ApiOperation({ summary: 'Создание статьи' })
  @ApiBearerAuth()
  @ApiBody({ type: ArticleCreateDto, description: 'Данные для создания статьи' })
  @ApiResponse({ type: ArticleDto, description: 'Статья', status: HttpStatus.CREATED })
  @ApiResponse({ type: ErrorDto, description: 'Ошибка авторизации', status: HttpStatus.UNAUTHORIZED })
  public async create(
    @Body(new ValidationPipe({ transform: true })) dto: ArticleCreateDto,
    @CurrentUser() user: AccessTokenPayloadType
  ): Promise<ArticleDto> {
    return await this.articleService.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление статьи' })
  @ApiBearerAuth()
  @ApiBody({ type: ArticleUpdateDto, description: 'Данные для обновления статьи' })
  @ApiResponse({ type: ArticleDto, description: 'Статья', status: HttpStatus.OK })
  @ApiResponse({ type: ErrorDto, description: 'Ошибка авторизации', status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: ErrorDto, description: 'Отсутствует доступ', status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: ErrorDto, description: 'Не найдено', status: HttpStatus.NOT_FOUND })
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ transform: true })) dto: ArticleUpdateDto,
    @CurrentUser() user: AccessTokenPayloadType
  ): Promise<ArticleDto> {
    return await this.articleService.update(dto, id, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удаление статьи' })
  @ApiBearerAuth()
  @ApiResponse({ description: 'Статья удалена', status: HttpStatus.NO_CONTENT })
  @ApiResponse({ type: ErrorDto, description: 'Ошибка авторизации', status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ type: ErrorDto, description: 'Отсутствует доступ', status: HttpStatus.FORBIDDEN })
  @ApiResponse({ type: ErrorDto, description: 'Не найдено', status: HttpStatus.NOT_FOUND })
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AccessTokenPayloadType
  ): Promise<void> {
    await this.articleService.remove(id, user.id);
  }
}
