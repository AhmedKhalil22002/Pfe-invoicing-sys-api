import { HttpException, HttpStatus } from '@nestjs/common';

export class ArticlePurchaseInvoiceEntryNotFoundException extends HttpException {
  constructor() {
    super('Article Purchase Invoice Entry not found', HttpStatus.NOT_FOUND);
  }
}
