import { Controller } from '@nestjs/common';
import { ArticleQuotationEntryService } from '../services/article-quotation-entry.service';
import { ApiTags } from '@nestjs/swagger';

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
