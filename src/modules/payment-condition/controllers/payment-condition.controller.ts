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
import { PaymentConditionService } from '../services/payment-condition.service';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PagingQueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { ResponsePaymentConditionDto } from '../dtos/payment-condition.response.dto';
import { CreatePaymentConditionDto } from '../dtos/payment-condition.create.dto';
import { UpdatePaymentConditionDto } from '../dtos/payment-condition.update.dto';

@ApiTags('payment-condition')
@Controller({
  version: '1',
  path: '/payment-condition',
})
export class PaymentConditionController {
  constructor(
    private readonly paymentConditionService: PaymentConditionService,
  ) {}

  @Get('/all')
  async findAll(): Promise<ResponsePaymentConditionDto[]> {
    return await this.paymentConditionService.findAll();
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponsePaymentConditionDto)
  async findAllPaginated(
    @Query() options: PagingQueryOptionsDto<ResponsePaymentConditionDto>,
  ): Promise<PageDto<ResponsePaymentConditionDto>> {
    return await this.paymentConditionService.findAllPaginated(options);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(
    @Param('id') id: number,
  ): Promise<ResponsePaymentConditionDto> {
    return await this.paymentConditionService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createPaymentConditionDto: CreatePaymentConditionDto,
  ): Promise<ResponsePaymentConditionDto> {
    return await this.paymentConditionService.save(createPaymentConditionDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updatePaymentConditionDto: UpdatePaymentConditionDto,
  ): Promise<ResponsePaymentConditionDto> {
    return await this.paymentConditionService.update(
      id,
      updatePaymentConditionDto,
    );
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponsePaymentConditionDto> {
    return await this.paymentConditionService.softDelete(id);
  }
}
