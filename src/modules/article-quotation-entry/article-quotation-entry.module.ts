import { Module } from '@nestjs/common';
import { ArticleQuotationEntryService } from './services/article-quotation-entry.service';
import { ArticleQuotationEntryRepositoryModule } from './repositories/article-quotation-entry.repository.module';
import { ArticleModule } from '../article/article.module';
import { TaxModule } from '../tax/tax.module';

@Module({
  controllers: [],
  providers: [ArticleQuotationEntryService],
  exports: [ArticleQuotationEntryService],
  imports: [ArticleQuotationEntryRepositoryModule, ArticleModule, TaxModule],
})
export class ArticleQuotationEntryModule {}
