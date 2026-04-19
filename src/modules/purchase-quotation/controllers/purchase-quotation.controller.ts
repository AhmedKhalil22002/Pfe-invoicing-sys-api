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
import { PurchaseQuotationService } from '../services/purchase-quotation.service';
import { ResponsePurchaseQuotationDto } from '../dtos/purchase-quotation.response.dto';
import { CreatePurchaseQuotationDto } from '../dtos/purchase-quotation.create.dto';
import { UpdatePurchaseQuotationDto } from '../dtos/purchase-quotation.update.dto';
import { UpdatePurchaseQuotationSequenceDto } from '../dtos/purchase-quotation-seqence.update.dto';
import { DuplicatePurchaseQuotationDto } from '../dtos/purchase-quotation.duplicate.dto';
import { PurchaseQuotationSequence } from '../interfaces/purchase-quotation-sequence.interface';
import { PURCHASE_QUOTATION_STATUS } from '../enums/purchase-quotation-status.enum';
import { PurchaseInvoiceService } from 'src/modules/purchase-invoice/services/purchase-invoice.service';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { EVENT_TYPE } from 'src/shared/logger/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';

@ApiTags('purchase-quotation')
@Controller('/purchase-quotation')
@UseInterceptors(LogInterceptor)
export class PurchaseQuotationController {
  constructor(
    private readonly purchaseQuotationService: PurchaseQuotationService,
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
  ) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponsePurchaseQuotationDto[]> {
    return this.purchaseQuotationService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponsePurchaseQuotationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponsePurchaseQuotationDto>> {
    return this.purchaseQuotationService.findAllPaginated(query);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'number', required: true })
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponsePurchaseQuotationDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return this.purchaseQuotationService.findOneByCondition(query);
  }

  @Get('/:id/download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="purchaseQuotation.pdf"')
  @LogEvent(EVENT_TYPE.BUYING_QUOTATION_PRINTED)
  async generatePdf(
    @Param('id') id: number,
    @Query() query: { template: string },
    @Request() req: AdvancedRequest,
  ) {
    req.logInfo = { id };
    return this.purchaseQuotationService.downloadPdf(id, query.template);
  }

  @Post('')
  @LogEvent(EVENT_TYPE.BUYING_QUOTATION_CREATED)
  async save(
    @Body() createPurchaseQuotationDto: CreatePurchaseQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseQuotationDto> {
    const purchaseQuotation = await this.purchaseQuotationService.save(createPurchaseQuotationDto);
    req.logInfo = { id: purchaseQuotation.id };
    return purchaseQuotation;
  }

  @Post('/duplicate')
  @LogEvent(EVENT_TYPE.BUYING_QUOTATION_DUPLICATED)
  async duplicate(
    @Body() duplicatePurchaseQuotationDto: DuplicatePurchaseQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseQuotationDto> {
    const purchaseQuotation = await this.purchaseQuotationService.duplicate(
      duplicatePurchaseQuotationDto,
    );
    req.logInfo = { id: duplicatePurchaseQuotationDto.id, duplicateId: purchaseQuotation.id };
    return purchaseQuotation;
  }

  @Put('/update-purchase-quotation-sequences')
  @ApiParam({ name: 'id', type: 'number', required: true })
  async updatePurchaseQuotationSequences(
    @Body() updatedSequenceDto: UpdatePurchaseQuotationSequenceDto,
  ): Promise<PurchaseQuotationSequence> {
    return this.purchaseQuotationService.updatePurchaseQuotationSequence(updatedSequenceDto);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiParam({ name: 'create', type: 'boolean', required: false })
  @Put('/invoice/:id/:create')
  @LogEvent(EVENT_TYPE.BUYING_QUOTATION_INVOICED)
  async invoice(
    @Param('id') id: number,
    @Param('create') create: boolean,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseQuotationDto> {
    req.logInfo = { quotationId: id, invoiceId: null };
    const purchaseQuotation = await this.purchaseQuotationService.findOneByCondition({
      filter: `id||$eq||${id}`,
      join:
        'purchaseQuotationMetaData,' +
        'articlePurchaseQuotationEntries,' +
        `articlePurchaseQuotationEntries.article,` +
        `articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes,` +
        `articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes.tax`,
    });
    if (purchaseQuotation.status === PURCHASE_QUOTATION_STATUS.Invoiced || create) {
      const invoice = await this.purchaseInvoiceService.saveFromQuotation(purchaseQuotation);
      req.logInfo.invoiceId = invoice.id;
    }
    await this.purchaseQuotationService.updateStatus(id, PURCHASE_QUOTATION_STATUS.Invoiced);
    return this.purchaseQuotationService.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'purchaseInvoices',
    });
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @Put('/:id')
  @LogEvent(EVENT_TYPE.BUYING_QUOTATION_UPDATED)
  async update(
    @Param('id') id: number,
    @Body() updatePurchaseQuotationDto: UpdatePurchaseQuotationDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseQuotationDto> {
    req.logInfo = { id };
    return this.purchaseQuotationService.update(id, updatePurchaseQuotationDto);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @Delete('/:id')
  @LogEvent(EVENT_TYPE.BUYING_QUOTATION_DELETED)
  async delete(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseQuotationDto> {
    req.logInfo = { id };
    return this.purchaseQuotationService.softDelete(id);
  }
}
