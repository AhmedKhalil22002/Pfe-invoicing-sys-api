import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { QuotationService } from '../services/quotation.service';
import { ResponseQuotationDto } from '../dtos/quotation.response.dto';
import { CreateQuotationDto } from '../dtos/quotation.create.dto';
import { UpdateQuotationDto } from '../dtos/quotation.update.dto';
import { UpdateQuotationSequenceDto } from '../dtos/quotation-seqence.update.dto';
import { DuplicateQuotationDto } from '../dtos/quotation.duplicate.dto';
import { QuotationSequence } from '../interfaces/quotation-sequence.interface';
import { QUOTATION_STATUS } from '../enums/quotation-status.enum';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { EVENT_TYPE } from 'src/shared/logger/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';

@ApiTags('quotation')
@Controller('/quotation')
@UseInterceptors(LogInterceptor)
export class QuotationController {
  constructor(
    private readonly quotationService: QuotationService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseQuotationDto[]> {
    return this.quotationService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseQuotationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseQuotationDto>> {
    return this.quotationService.findAllPaginated(query);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'number', required: true })
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponseQuotationDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return this.quotationService.findOneByCondition(query);
  }

  @Get('/:id/download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="quotation.pdf"')
  @LogEvent(EVENT_TYPE.SELLING_QUOTATION_PRINTED)
  async generatePdf(
    @Param('id') id: number,
    @Query() query: { template: string },
    @Request() req: AdvancedRequest,
  ) {
    req.logInfo = { id };
    return this.quotationService.downloadPdf(id, query.template);
  }

  @Post('')
  @LogEvent(EVENT_TYPE.SELLING_QUOTATION_CREATED)
  async save(
    @Body() createQuotationDto: CreateQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto> {
    const quotation = await this.quotationService.save(createQuotationDto);
    req.logInfo = { id: quotation.id };
    return quotation;
  }

  @Post('/duplicate')
  @LogEvent(EVENT_TYPE.SELLING_QUOTATION_DUPLICATED)
  async duplicate(
    @Body() duplicateQuotationDto: DuplicateQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto> {
    const quotation = await this.quotationService.duplicate(
      duplicateQuotationDto,
    );
    req.logInfo = { id: duplicateQuotationDto.id, duplicateId: quotation.id };
    return quotation;
  }

  @Put('/update-quotation-sequences')
  @ApiParam({ name: 'id', type: 'number', required: true })
  async updateQuotationSequences(
    @Body() updatedSequenceDto: UpdateQuotationSequenceDto,
  ): Promise<QuotationSequence> {
    return this.quotationService.updateQuotationSequence(updatedSequenceDto);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiParam({ name: 'create', type: 'boolean', required: false })
  @Put('/invoice/:id/:create')
  @LogEvent(EVENT_TYPE.SELLING_QUOTATION_INVOICED)
  async invoice(
    @Param('id') id: number,
    @Param('create') create: boolean,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto> {
    req.logInfo = { quotationId: id, invoiceId: null };
    const quotation = await this.quotationService.findOneByCondition({
      filter: `id||$eq||${id}`,
      join:
        'quotationMetaData,' +
        'articleQuotationEntries,' +
        `articleQuotationEntries.article,` +
        `articleQuotationEntries.articleQuotationEntryTaxes,` +
        `articleQuotationEntries.articleQuotationEntryTaxes.tax`,
    });
    if (quotation.status === QUOTATION_STATUS.Invoiced || create) {
      const invoice = await this.invoiceService.saveFromQuotation(quotation);
      req.logInfo.invoiceId = invoice.id;
    }
    await this.quotationService.updateStatus(id, QUOTATION_STATUS.Invoiced);
    return this.quotationService.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'invoices',
    });
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @Put('/:id')
  @LogEvent(EVENT_TYPE.SELLING_QUOTATION_UPDATED)
  async update(
    @Param('id') id: number,
    @Body() updateQuotationDto: UpdateQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto> {
    req.logInfo = { id };
    return this.quotationService.update(id, updateQuotationDto);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @Delete('/:id')
  @LogEvent(EVENT_TYPE.SELLING_QUOTATION_DELETED)
  async delete(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseQuotationDto> {
    req.logInfo = { id };
    return this.quotationService.softDelete(id);
  }
}
