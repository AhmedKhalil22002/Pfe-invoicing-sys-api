import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentMethodNotFoundException extends HttpException {
  constructor() {
    super('Payment Method not found', HttpStatus.NOT_FOUND);
  }
}
