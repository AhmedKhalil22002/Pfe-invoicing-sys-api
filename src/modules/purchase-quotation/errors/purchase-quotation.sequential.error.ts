import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseQuotationSequentialNotFoundException extends HttpException {
  constructor() {
    super('Cannot get PurchaseQuotation Sequential Number', HttpStatus.NOT_FOUND);
  }
}
