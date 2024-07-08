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
import { PagingQueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
@ApiTags('tax')
@Controller({
  version: '1',
  path: '/tax',
})
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseTaxDto)
  async findAllPaginated(
    @Query() options: PagingQueryOptionsDto<ResponseTaxDto>,
  ): Promise<PageDto<ResponseTaxDto>> {
    return await this.taxService.findAllPaginated(options);
  }

  @Get('/all')
  async findAll(): Promise<ResponseTaxDto[]> {
    return await this.taxService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseTaxDto> {
    const tax = await this.taxService.findOneById(id);
    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }
    return tax;
  }

  @Post('')
  async save(@Body() createTaxDto: CreateTaxDto): Promise<ResponseTaxDto> {
    const activity = await this.taxService.findOneByCondition({
      filters: { label: createTaxDto.label },
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
