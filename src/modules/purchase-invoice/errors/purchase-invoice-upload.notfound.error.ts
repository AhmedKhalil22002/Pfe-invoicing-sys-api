import { HttpException, HttpStatus } from '@nestjs/common';

export class PurchaseInvoiceUploadNotFoundException extends HttpException {
  constructor() {
    super('Purchase Invoice upload not found', HttpStatus.NOT_FOUND);
  }
}
