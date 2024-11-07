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
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { InvoiceService } from '../services/invoice.service';
import { ResponseInvoiceDto } from '../dtos/invoice.response.dto';
import { CreateInvoiceDto } from '../dtos/invoice.create.dto';
import { DuplicateInvoiceDto } from '../dtos/invoice.duplicate.dto';
import { InvoiceSequence } from '../interfaces/invoice-sequence.interface';
import { UpdateInvoiceSequenceDto } from '../dtos/invoice-seqence.update.dto';
import { UpdateInvoiceDto } from '../dtos/invoice.update.dto';

@ApiTags('invoice')
@Controller({
  version: '1',
  path: '/invoice',
})
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseInvoiceDto[]> {
    return await this.invoiceService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseInvoiceDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseInvoiceDto>> {
    return await this.invoiceService.findAllPaginated(query);
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
  ): Promise<ResponseInvoiceDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.invoiceService.findOneByCondition(query);
  }

  @Get('/:id/download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="invoice.pdf"')
  async generatePdf(
    @Param('id') id: number,
    @Query() query: { template: string },
  ) {
    return this.invoiceService.downloadPdf(id, query.template);
  }

  @Post('')
  async save(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    return await this.invoiceService.save(createInvoiceDto);
  }

  @Post('/duplicate')
  async duplicate(
    @Body() duplicateInvoiceDto: DuplicateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    return await this.invoiceService.duplicate(duplicateInvoiceDto);
  }

  @Put('/update-invoice-sequences')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async updateInvoiceSequences(
    @Body() updatedSequenceDto: UpdateInvoiceSequenceDto,
  ): Promise<InvoiceSequence> {
    return await this.invoiceService.updateInvoiceSequence(updatedSequenceDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    return await this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseInvoiceDto> {
    return await this.invoiceService.softDelete(id);
  }
}
