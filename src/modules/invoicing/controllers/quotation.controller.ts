import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { QuotationService } from '../services/quotation.service';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { ResponseQuotationDto } from './dtos/response-quotation.dto';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EVENT_TYPE } from 'src/shared/logger/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { CreateQuotationDto } from './dtos/create-quotation.dto';
import { UpdateQuotationDto } from './dtos/update-quotation.dto';

@ApiTags('_quotation')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/_quotation',
})
export class PseudoQuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseQuotationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseQuotationDto>> {
    const paginated = await this.quotationService.findAllPaginated(query);
    return {
      ...paginated,
      data: toDtoArray(ResponseQuotationDto, paginated.data),
    };
  }

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseQuotationDto[]> {
    return toDtoArray(
      ResponseQuotationDto,
      await this.quotationService.findAll(options),
    );
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponseQuotationDto | null> {
    return toDto(
      ResponseQuotationDto,
      await this.quotationService.findOneById(id),
    );
  }

  @Post()
  @LogEvent(EVENT_TYPE.QUOTATION_CREATED)
  async create(
    @Body() createQuotationDto: CreateQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto> {
    const quotation = await this.quotationService.save(createQuotationDto);
    req.logInfo = {
      id: quotation.id,
      //seqence: quotation.sequence,
      direction: quotation.direction,
    };
    return toDto(ResponseQuotationDto, quotation);
  }

  //   @Post('duplicate/:id')
  //   @LogEvent(EventType.ROLE_DUPLICATE)
  //   async duplicate(
  //     @Param('id') id: string,
  //     @Request() req: AdvancedRequest,
  //   ): Promise<ResponseRoleDto | null> {
  //     const role = await this.roleService.duplicateWithPermissions(id);
  //     req.logInfo = { id: role?.id, fid: id, label: role?.label };
  //     return toDto(ResponseRoleDto, role);
  //   }

  @Put(':id')
  @LogEvent(EVENT_TYPE.QUOTATION_UPDATED)
  async update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto | null> {
    const quotation = await this.quotationService.update(
      id,
      updateQuotationDto,
    );
    req.logInfo = {
      id,
      // seqence: quotation?.sequence,
      direction: quotation?.direction,
    };
    return toDto(ResponseQuotationDto, quotation);
  }

  @Delete(':id')
  @LogEvent(EVENT_TYPE.QUOTATION_DELETED)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto | null> {
    const quotation = await this.quotationService.softDelete(id);
    req.logInfo = {
      id,
      //seqence: quotation?.sequence,
      direction: quotation?.direction,
    };
    return toDto(ResponseQuotationDto, quotation);
  }
}
