import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../services/logger.service';
import { LoggerEntity } from '../entities/logger.entity';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';

@ApiTags('logger')
@Controller({ version: '1', path: '/logger' })
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<LoggerEntity[]> {
    return await this.loggerService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(LoggerEntity)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<LoggerEntity>> {
    return await this.loggerService.findAllPaginated(query);
  }
}
