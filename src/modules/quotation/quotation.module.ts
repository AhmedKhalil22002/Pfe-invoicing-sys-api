import { Module } from '@nestjs/common';
import { QuotationService } from './services/quotation.service';
import { QuotationRepositoryModule } from './repositories/quotation.repository.module';
import { CurrencyModule } from '../currency/currency.module';
import { FirmModule } from '../firm/firm.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';
import { ArticleQuotationEntryService } from './services/article-quotation-entry.service';
import { ArticleQuotationEntryTaxService } from './services/article-quotation-entry-tax.service';
import { TaxModule } from '../tax/tax.module';
import { ArticleModule } from '../article/article.module';

@Module({
  controllers: [],
  providers: [
    QuotationService,
    ArticleQuotationEntryService,
    ArticleQuotationEntryTaxService,
  ],
  exports: [QuotationService],
  imports: [
    QuotationRepositoryModule,
    ArticleModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
    TaxModule,
  ],
})
export class QuotationModule {}
