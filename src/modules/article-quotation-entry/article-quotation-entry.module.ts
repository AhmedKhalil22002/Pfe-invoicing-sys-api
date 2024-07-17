import { Module } from '@nestjs/common';
import { ArticleQuotationEntryService } from './services/article-quotation-entry.service';
import { ArticleQuotationEntryRepositoryModule } from './repositories/article-quotation-entry.repository.module';
import { ArticleModule } from '../article/article.module';
import { TaxModule } from '../tax/tax.module';
import { ArticleQuotationEntryTaxService } from './services/article-quotation-entry-tax.service';

@Module({
  controllers: [],
  providers: [ArticleQuotationEntryService, ArticleQuotationEntryTaxService],
  exports: [ArticleQuotationEntryService, ArticleQuotationEntryTaxService],
  imports: [ArticleQuotationEntryRepositoryModule, ArticleModule, TaxModule],
})
export class ArticleQuotationEntryModule {}
