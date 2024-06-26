import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { PaymentMethodService } from '../services/payment-method.service';
import { ResponsePaymentMethodDto } from '../dtos/payment-method.response.dto';

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
}
