import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dtos/address.create';
import { UpdateAddressDto } from '../dtos/address.update';
import { ResponseAddressDto } from '../dtos/address.response';

@ApiTags('address')
@Controller({
  version: '1',
  path: '/address',
})
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseAddressDto> {
    return await this.addressService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<ResponseAddressDto> {
    return await this.addressService.save(createAddressDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateAddressDto,
  ): Promise<ResponseAddressDto> {
    return await this.addressService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseAddressDto> {
    return await this.addressService.softDelete(id);
  }
}
