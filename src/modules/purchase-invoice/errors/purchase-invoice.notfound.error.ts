import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseInvoiceNotFoundException extends HttpException {
  constructor() {
    super('Purchase Invoice not found', HttpStatus.NOT_FOUND);
  }
}
