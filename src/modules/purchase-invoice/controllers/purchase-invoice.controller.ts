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
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PurchaseInvoiceService } from '../services/purchase-invoice.service';
import { ResponsePurchaseInvoiceDto } from '../dtos/purchase-invoice.response.dto';
import { CreatePurchaseInvoiceDto } from '../dtos/purchase-invoice.create.dto';
import { DuplicateInvoiceDto } from 'src/modules/invoice/dtos/invoice.duplicate.dto';
import { SequenceEntity } from 'src/modules/sequence/entities/sequence.entity';
import { UpdatePurchaseInvoiceSequenceDto } from '../dtos/purchase-invoice-seqence.update.dto';
import { UpdatePurchaseInvoiceDto } from '../dtos/purchase-invoice.update.dto';
import { ResponsePurchaseInvoiceRangeDto } from '../dtos/purchase-invoice-range.response.dto';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { EVENT_TYPE } from 'src/shared/logger/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';

@ApiTags('purchase-invoice')
@Controller({ version: '1', path: '/purchase-invoice' })
@UseInterceptors(LogInterceptor)
export class PurchaseInvoiceController {
  constructor(private readonly purchaseInvoiceService: PurchaseInvoiceService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponsePurchaseInvoiceDto[]> {
    return this.purchaseInvoiceService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponsePurchaseInvoiceDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponsePurchaseInvoiceDto>> {
    return this.purchaseInvoiceService.findAllPaginated(query);
  }

  @Get('/sequential-range/:id')
  async findInvoicesByRange(
    @Param('id') id: number,
  ): Promise<ResponsePurchaseInvoiceRangeDto> {
    return this.purchaseInvoiceService.findInvoicesByRange(id);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'number', required: true })
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponsePurchaseInvoiceDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return this.purchaseInvoiceService.findOneByCondition(query);
  }

  @Get('/:id/download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="purchase-invoice.pdf"')
  @LogEvent(EVENT_TYPE.BUYING_INVOICE_PRINTED)
  async generatePdf(
    @Param('id') id: number,
    @Query() query: { template: string },
    @Request() req: AdvancedRequest,
  ) {
    req.logInfo = { id };
    return this.purchaseInvoiceService.downloadPdf(id, query.template);
  }

  @Post('')
  @LogEvent(EVENT_TYPE.BUYING_INVOICE_CREATED)
  async save(
    @Body() createPurchaseInvoiceDto: CreatePurchaseInvoiceDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseInvoiceDto> {
    const invoice = await this.purchaseInvoiceService.save(createPurchaseInvoiceDto);
    req.logInfo = { id: invoice.id };
    return invoice;
  }

  @Post('/duplicate')
  @LogEvent(EVENT_TYPE.BUYING_INVOICE_DUPLICATED)
  async duplicate(
    @Body() duplicateInvoiceDto: DuplicateInvoiceDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseInvoiceDto> {
    const invoice = await this.purchaseInvoiceService.duplicate(duplicateInvoiceDto.id, duplicateInvoiceDto.includeFiles);
    req.logInfo = { id: duplicateInvoiceDto.id, duplicateId: invoice.id };
    return invoice;
  }

  @Put('/update-invoice-sequences')
  async updateInvoiceSequences(
    @Body() updatedSequenceDto: UpdatePurchaseInvoiceSequenceDto,
  ): Promise<SequenceEntity> {
    return this.purchaseInvoiceService.updateInvoiceSequence(updatedSequenceDto);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @Put('/:id')
  @LogEvent(EVENT_TYPE.BUYING_INVOICE_UPDATED)
  async update(
    @Param('id') id: number,
    @Body() updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseInvoiceDto> {
    req.logInfo = { id };
    return this.purchaseInvoiceService.update(id, updatePurchaseInvoiceDto);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @Delete('/:id')
  @LogEvent(EVENT_TYPE.BUYING_INVOICE_DELETED)
  async delete(
    @Param('id') id: number,
    @Request() req: AdvancedRequest,
  ): Promise<ResponsePurchaseInvoiceDto> {
    req.logInfo = { id };
    return this.purchaseInvoiceService.softDelete(id);
  }
}
