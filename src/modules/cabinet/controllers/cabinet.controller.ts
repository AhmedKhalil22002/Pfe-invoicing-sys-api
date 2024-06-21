import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CabinetService } from '../services/cabinet.service';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { CabinetEntity } from '../repositories/entities/cabinet.entity';
import { CreateCabinetDto } from '../dtos/cabinet.create.dto';
import { ResponseCabinetDto } from '../dtos/cabinet.response.dto';
import { AddressService } from 'src/modules/address/services/address.service';
import { UpdateCabinetDto } from '../dtos/cabinet.update.dto';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { CountryService } from 'src/modules/country/services/country.service';

@ApiTags('cabinet')
@Controller({
  version: '1',
  path: '/cabinet',
})
export class CabinetController {
  constructor(
    private readonly cabinetService: CabinetService,
    private readonly activityService: ActivityService,
    private readonly addressService: AddressService,
    private readonly currencyService: CurrencyService,
    private readonly countryService: CountryService,
  ) {}

  @Get('/list')
  async findAll(): Promise<ResponseCabinetDto[]> {
    return await this.cabinetService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseCabinetDto> {
    const cabinet = await this.cabinetService.findOneById(id);
    const address = await this.addressService.findOneById(cabinet.addressId);
    const currency = await this.currencyService.findOneById(cabinet.currencyId);
    const activity = await this.activityService.findOneById(cabinet.activityId);
    const country = await this.countryService.findOneById(address.countryId);
    return {
      ...cabinet,
      address: { ...address, country: country },
      activity: activity,
      currency: currency,
    };
  }

  @Post('')
  async save(
    @Body() createCabinetDto: CreateCabinetDto,
  ): Promise<ResponseCabinetDto> {
    return this.cabinetService.save(createCabinetDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateCabinetDto: UpdateCabinetDto,
  ): Promise<CabinetEntity> {
    return this.cabinetService.update(id, updateCabinetDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<CabinetEntity> {
    return this.cabinetService.softDelete(id);
  }
}
