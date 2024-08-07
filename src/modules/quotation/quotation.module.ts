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
import { PdfModule } from 'src/common/pdf/pdf.module';
import { CalculationsModule } from 'src/common/calculations/calculations.module';

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
    PdfModule,
    CalculationsModule,
  ],
})
export class QuotationModule {}
