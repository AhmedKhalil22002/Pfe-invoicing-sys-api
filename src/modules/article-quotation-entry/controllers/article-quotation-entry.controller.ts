import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticleQuotationEntryService } from '../services/article-quotation-entry.service';

@ApiTags('article-quotation-entry.service')
@Controller({
  version: '1',
  path: '/article-quotation-entry.service',
})
export class ArticleQuotationEntryController {
  constructor(
    private readonly articleQuotationEntryService: ArticleQuotationEntryService,
  ) {}
}
