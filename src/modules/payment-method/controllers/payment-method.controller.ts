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
import { PaymentMethodService } from '../services/payment-method.service';
import { ResponsePaymentMethodDto } from '../dtos/payment-method.response.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PagingQueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { CreatePaymentMethodDto } from '../dtos/payment-method.create.dto';
import { UpdatePaymentMethodDto } from '../dtos/payment-method.update.dto';

@ApiTags('payment-method')
@Controller({
  version: '1',
  path: '/payment-method',
})
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get('/all')
  async findAll(): Promise<ResponsePaymentMethodDto[]> {
    return await this.paymentMethodService.findAll();
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponsePaymentMethodDto)
  async findAllPaginated(
    @Query() options: PagingQueryOptionsDto<ResponsePaymentMethodDto>,
  ): Promise<PageDto<ResponsePaymentMethodDto>> {
    return await this.paymentMethodService.findAllPaginated(options);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponsePaymentMethodDto> {
    return await this.paymentMethodService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<ResponsePaymentMethodDto> {
    return await this.paymentMethodService.save(createPaymentMethodDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<ResponsePaymentMethodDto> {
    return await this.paymentMethodService.update(id, updatePaymentMethodDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponsePaymentMethodDto> {
    return await this.paymentMethodService.softDelete(id);
  }
}
