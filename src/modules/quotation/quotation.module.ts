import { Module } from '@nestjs/common';
import { QuotationService } from './services/quotation.service';
import { QuotationRepositoryModule } from './repositories/quotation.repository.module';
import { CurrencyModule } from '../currency/currency.module';
import { FirmModule } from '../firm/firm.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';
import { ArticleQuotationEntryModule } from '../article-quotation-entry/article-quotation-entry.module';

@Module({
  controllers: [],
  providers: [QuotationService],
  exports: [QuotationService],
  imports: [
    ArticleQuotationEntryModule,
    QuotationRepositoryModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
  ],
})
export class QuotationModule {}
