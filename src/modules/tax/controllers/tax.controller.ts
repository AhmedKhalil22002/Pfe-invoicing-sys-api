import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  NotFoundException,
  Param,
  Query,
  Body,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { TaxService } from '../services/tax.service';
import { TaxEntity } from '../repositories/entities/tax.entity';
import { PageOptionsDto } from 'src/common/database/interfaces/database.pagination.interface';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { ActivityEntity } from 'src/modules/activity/repositories/entities/activity.entity';
import { CreateTaxDto } from '../dtos/tax.create.dto';
import { UpdateTaxDto } from '../dtos/tax.update.dto';

@ApiTags('tax')
@Controller({
  version: '1',
  path: '/tax',
})
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('/list')
  @ApiPaginatedResponse(TaxEntity)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ActivityEntity>> {
    return await this.taxService.findAll(pageOptionsDto);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<Record<string, any>> {
    const tax = await this.taxService.findOneById(id);
    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }
    return tax;
  }

  @Post('')
  async save(@Body() createTaxDto: CreateTaxDto): Promise<Record<string, any>> {
    const activity = await this.taxService.findOneByLabel(createTaxDto.label);
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
  ): Promise<Record<string, any>> {
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
  async delete(@Param('id') id: number): Promise<Record<string, any>> {
    const tax = await this.taxService.softDelete(id);
    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }
    return tax;
  }
}
