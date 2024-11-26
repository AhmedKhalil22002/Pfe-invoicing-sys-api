import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  NotFoundException,
  Param,
  Body,
  ConflictException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { TaxWithholdingService } from '../services/tax-withholding.service';
import { ResponseTaxWithholdingDto } from '../dtos/tax-withholding.response.dto';
import { CreateTaxWithholdingDto } from '../dtos/tax-withholding.create.dto';
import { UpdateTaxWithholdingDto } from '../dtos/tax-withholding.update.dto';

@ApiTags('tax-withholding')
@Controller({
  version: '1',
  path: '/tax-withholding',
})
export class TaxWithholdingController {
  constructor(private readonly taxWithholdingService: TaxWithholdingService) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseTaxWithholdingDto[]> {
    return await this.taxWithholdingService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseTaxWithholdingDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseTaxWithholdingDto>> {
    return await this.taxWithholdingService.findAllPaginated(query);
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
  ): Promise<ResponseTaxWithholdingDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.taxWithholdingService.findOneByCondition(query);
  }

  @Post('')
  async save(
    @Body() createTaxWithholdingDto: CreateTaxWithholdingDto,
  ): Promise<ResponseTaxWithholdingDto> {
    const tax = await this.taxWithholdingService.findOneByCondition({
      filter: `label||$eq||${createTaxWithholdingDto.label}`,
    });
    if (tax) {
      throw new ConflictException(
        `Tax withholding with label "${createTaxWithholdingDto.label}" already exists`,
      );
    }
    return await this.taxWithholdingService.save(createTaxWithholdingDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateTaxWithholdingDto: UpdateTaxWithholdingDto,
  ): Promise<ResponseTaxWithholdingDto> {
    const tax = await this.taxWithholdingService.update(
      id,
      updateTaxWithholdingDto,
    );
    if (!tax) {
      throw new NotFoundException(`Tax withholding with ID ${id} not found`);
    }
    return tax;
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseTaxWithholdingDto> {
    const tax = await this.taxWithholdingService.softDelete(id);
    if (!tax) {
      throw new NotFoundException(`Tax withholding with ID ${id} not found`);
    }
    return tax;
  }
}
