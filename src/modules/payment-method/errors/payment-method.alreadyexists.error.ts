import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentMethodAlreadyExistsException extends HttpException {
  constructor() {
    super('Payment Method already exists', HttpStatus.CONFLICT);
  }
}
