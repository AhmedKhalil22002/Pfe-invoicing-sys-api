import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { QuotationService } from '../services/quotation.service';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { ResponseQuotationDto } from '../dtos/quotation.response.dto';
import { PagingQueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { CreateQuotationDto } from '../dtos/quotation.create.dto';
import { UpdateQuotationDto } from '../dtos/quotation.update.dto';

@ApiTags('quotation')
@Controller({
  version: '1',
  path: '/quotation',
})
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseQuotationDto)
  async findAllPaginated(
    @Query() options: PagingQueryOptionsDto<ResponseQuotationDto>,
  ): Promise<PageDto<ResponseQuotationDto>> {
    return await this.quotationService.findAllPaginated(options);
  }

  @Get('/all')
  async findAll(): Promise<ResponseQuotationDto[]> {
    return await this.quotationService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseQuotationDto> {
    return await this.quotationService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createQuotationDto: CreateQuotationDto,
  ): Promise<ResponseQuotationDto> {
    return await this.quotationService.save(createQuotationDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateQuotationDto,
  ): Promise<ResponseQuotationDto> {
    return await this.quotationService.update(id, updateActivityDto);
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
