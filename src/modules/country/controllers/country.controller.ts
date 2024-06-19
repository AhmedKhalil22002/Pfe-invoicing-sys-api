import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { CountryService } from '../services/country.service';
import { CountryEntity } from '../repositories/entities/country.entity';

@ApiTags('country')
@Controller({
  version: '1',
  path: '/country',
})
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('/list')
  async findAll(): Promise<CountryEntity[]> {
    return await this.countryService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<Record<string, any>> {
    const country = await this.countryService.findOneById(id);
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }
}
