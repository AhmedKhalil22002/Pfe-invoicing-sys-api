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
import { AppConfigModule } from 'src/common/app-config/app-config.module';
import { QuotationSequenceService } from './services/quotation-sequence.service';
import { GatewaysModule } from 'src/common/gateways/gateways.module';
import { QuotationMetaDataService } from './services/quotation-meta-data.service';
import { BankAccountModule } from '../bank-account/bank-account.module';

@Module({
  controllers: [],
  providers: [
    QuotationService,
    QuotationMetaDataService,
    QuotationSequenceService,
    ArticleQuotationEntryService,
    ArticleQuotationEntryTaxService,
  ],
  exports: [QuotationService],
  imports: [
    //repositories
    QuotationRepositoryModule,
    //entities
    ArticleModule,
    AppConfigModule,
    BankAccountModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
    TaxModule,
    //abstract modules
    PdfModule,
    GatewaysModule,
    CalculationsModule,
  ],
})
export class QuotationModule {}
