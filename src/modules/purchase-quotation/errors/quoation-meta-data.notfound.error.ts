import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseQuotationMetaDataNotFoundException extends HttpException {
  constructor() {
    super('PurchaseQuotation Meta Data not found', HttpStatus.NOT_FOUND);
  }
}
