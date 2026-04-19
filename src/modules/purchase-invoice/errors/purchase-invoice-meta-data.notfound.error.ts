import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseInvoiceMetaDataNotFoundException extends HttpException {
  constructor() {
    super('Purchase Invoice Meta Data not found', HttpStatus.NOT_FOUND);
  }
}
