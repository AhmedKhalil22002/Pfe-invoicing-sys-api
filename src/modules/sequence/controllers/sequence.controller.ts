import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { SequenceService } from '../services/sequence.service';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { ResponseSequenceDto } from '../dtos/response-sequence.dto';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EVENT_TYPE } from 'src/shared/logger/enums/event-type.enum';
import { UpdateSequenceDto } from '../dtos/upadate-sequence.dto';
import { AdvancedRequest } from 'src/types';

@ApiTags('sequence')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/sequence' })
export class SequenceController {
  constructor(private readonly sequenceService: SequenceService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseSequenceDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseSequenceDto>> {
    const paginated = await this.sequenceService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseSequenceDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseSequenceDto[]> {
    return toDtoArray(
      ResponseSequenceDto,
      await this.sequenceService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ResponseSequenceDto | null> {
    return toDto(
      ResponseSequenceDto,
      await this.sequenceService.findOneById(id),
    );
  }

  @Put(':id')
  @LogEvent(EVENT_TYPE.SEQUENCE_UPDATED)
  async update(
    @Param('id') id: string,
    @Body() updateSequenceDto: UpdateSequenceDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseSequenceDto | null> {
    const sequence = await this.sequenceService.update(id, updateSequenceDto);
    req.logInfo = { id, label: sequence?.label };
    return toDto(ResponseSequenceDto, sequence);
  }
}
