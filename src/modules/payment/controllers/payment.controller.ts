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
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { PaymentService } from '../services/payment.service';
import { ResponsePaymentDto } from '../dtos/payment.response.dto';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { UpdatePaymentDto } from '../dtos/payment.update.dto';

@ApiTags('payment')
@Controller({
  version: '1',
  path: '/payment',
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponsePaymentDto[]> {
    return await this.paymentService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponsePaymentDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponsePaymentDto>> {
    return await this.paymentService.findAllPaginated(query);
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
  ): Promise<ResponsePaymentDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.paymentService.findOneByCondition(query);
  }

  @Post('')
  async save(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ResponsePaymentDto> {
    return await this.paymentService.save(createPaymentDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdatePaymentDto,
  ): Promise<ResponsePaymentDto> {
    return await this.paymentService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponsePaymentDto> {
    return await this.paymentService.softDelete(id);
  }
}
