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
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { QuotationService } from '../services/quotation.service';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { ResponseQuotationDto } from '../dtos/quotation.response.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { CreateQuotationDto } from '../dtos/quotation.create.dto';
import { UpdateQuotationDto } from '../dtos/quotation.update.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { UpdateQuotationSequenceDto } from '../dtos/quotation-seqence.update.dto';
import { DuplicateQuotationDto } from '../dtos/quotation.duplicate.dto';
import { QuotationSequence } from '../interfaces/quotation-sequence.interface';
import { QUOTATION_STATUS } from '../enums/quotation-status.enum';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';

@ApiTags('quotation')
@Controller({
  version: '1',
  path: '/quotation',
})
export class QuotationController {
  constructor(
    private readonly quotationService: QuotationService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseQuotationDto[]> {
    return await this.quotationService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseQuotationDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseQuotationDto>> {
    return await this.quotationService.findAllPaginated(query);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponseQuotationDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.quotationService.findOneByCondition(query);
  }

  @Get('/:id/download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="quotation.pdf"')
  async generatePdf(
    @Param('id') id: number,
    @Query() query: { template: string },
  ) {
    return this.quotationService.downloadPdf(id, query.template);
  }

  @Post('')
  async save(
    @Body() createQuotationDto: CreateQuotationDto,
  ): Promise<ResponseQuotationDto> {
    return await this.quotationService.save(createQuotationDto);
  }

  @Post('/duplicate')
  async duplicate(
    @Body() duplicateQuotationDto: DuplicateQuotationDto,
  ): Promise<ResponseQuotationDto> {
    return await this.quotationService.duplicate(duplicateQuotationDto);
  }

  @Put('/update-quotation-sequences')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async updateQuotationSequences(
    @Body() updatedSequenceDto: UpdateQuotationSequenceDto,
  ): Promise<QuotationSequence> {
    return await this.quotationService.updateQuotationSequence(
      updatedSequenceDto,
    );
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ): Promise<ResponseQuotationDto> {
    if (
      updateQuotationDto.status === QUOTATION_STATUS.Invoiced &&
      updateQuotationDto.createInvoice
    ) {
      const quotation = await this.quotationService.findOneByCondition({
        filter: `id||$eq||${id}`,
        join:
          'quotationMetaData,' +
          'articleQuotationEntries,' +
          `articleQuotationEntries.article,` +
          `articleQuotationEntries.articleQuotationEntryTaxes,` +
          `articleQuotationEntries.articleQuotationEntryTaxes.tax`,
      });
      const invoice = await this.invoiceService.saveFromQuotation(quotation);
      updateQuotationDto.invoiceId = invoice.id;
    }
    return await this.quotationService.update(id, updateQuotationDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseQuotationDto> {
    return await this.quotationService.softDelete(id);
  }
}
