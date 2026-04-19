import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseInvoiceSequentialNotFoundException extends HttpException {
  constructor() {
    super('Cannot get Purchase Invoice Sequential Number', HttpStatus.NOT_FOUND);
  }
}
