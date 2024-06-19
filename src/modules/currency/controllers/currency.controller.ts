import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { CurrencyService } from '../services/currency.service';
import { CurrencyEntity } from '../repositories/entities/currency.entity';

@ApiTags('currency')
@Controller({
  version: '1',
  path: '/currency',
})
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('/list')
  async findAll(): Promise<CurrencyEntity[]> {
    return await this.currencyService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<Record<string, any>> {
    const currency = await this.currencyService.findOneById(id);
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return currency;
  }
}
