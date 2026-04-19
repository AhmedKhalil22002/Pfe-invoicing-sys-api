import { HttpException, HttpStatus } from '@nestjs/common';

export class ArticlePurchaseQuotationEntryNotFoundException extends HttpException {
  constructor() {
    super('Article PurchaseQuotation Entry not found', HttpStatus.NOT_FOUND);
  }
}
