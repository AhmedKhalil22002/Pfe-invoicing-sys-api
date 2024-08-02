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
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { CreateQuotationDto } from '../dtos/quotation.create.dto';
import { UpdateQuotationDto } from '../dtos/quotation.update.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';

@ApiTags('quotation')
@Controller({
  version: '1',
  path: '/quotation',
})
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

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
