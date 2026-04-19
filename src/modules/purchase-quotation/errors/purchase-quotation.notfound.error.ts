import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseQuotationNotFoundException extends HttpException {
  constructor() {
    super('PurchaseQuotation not found', HttpStatus.NOT_FOUND);
  }
}
