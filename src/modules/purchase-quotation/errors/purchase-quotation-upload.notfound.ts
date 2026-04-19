import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseQuotationUploadNotFoundException extends HttpException {
  constructor() {
    super('PurchaseQuotation upload not found', HttpStatus.NOT_FOUND);
  }
}
