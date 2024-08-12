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
import { TaxService } from '../services/tax.service';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { CreateTaxDto } from '../dtos/tax.create.dto';
import { UpdateTaxDto } from '../dtos/tax.update.dto';
import { ResponseTaxDto } from '../dtos/tax.response.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';

@ApiTags('tax')
@Controller({
  version: '1',
  path: '/tax',
})
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseTaxDto[]> {
    return await this.taxService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseTaxDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseTaxDto>> {
    return await this.taxService.findAllPaginated(query);
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
  ): Promise<ResponseTaxDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.taxService.findOneByCondition(query);
  }

  @Post('')
  async save(@Body() createTaxDto: CreateTaxDto): Promise<ResponseTaxDto> {
    const activity = await this.taxService.findOneByCondition({
      filter: `label||$eq||${createTaxDto.label}`,
    });
    if (activity) {
      throw new ConflictException(
        `Tax with label "${createTaxDto.label}" already exists`,
      );
    }
    return await this.taxService.save(createTaxDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateTaxDto: UpdateTaxDto,
  ): Promise<ResponseTaxDto> {
    const tax = await this.taxService.update(id, updateTaxDto);
    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }
    return tax;
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseTaxDto> {
    const tax = await this.taxService.softDelete(id);
    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }
    return tax;
  }
}
