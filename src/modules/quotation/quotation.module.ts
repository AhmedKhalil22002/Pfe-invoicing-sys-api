import { Module } from '@nestjs/common';
import { QuotationService } from './services/quotation.service';
import { QuotationRepository } from './repositories/quotation.repository'
import { CurrencyModule } from '../currency/currency.module';
import { FirmModule } from '../firm/firm.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';
import { ArticleQuotationEntryService } from './services/article-quotation-entry.service';
import { ArticleQuotationEntryTaxService } from './services/article-quotation-entry-tax.service';
import { TaxModule } from '../tax/tax.module';
import { ArticleModule } from '../article/article.module';
import { PdfModule } from 'src/shared/pdf/pdf.module';
import { CalculationsModule } from 'src/shared/calculations/calculations.module';
import { AppConfigModule } from 'src/shared/app-config/app-config.module';
import { QuotationSequenceService } from './services/quotation-sequence.service';
import { GatewaysModule } from 'src/shared/gateways/gateways.module';
import { QuotationMetaDataService } from './services/quotation-meta-data.service';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { StorageModule } from 'src/shared/storage/storage.module';
import { QuotationUploadService } from './services/quotation-upload.service';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  controllers: [],
  providers: [
    QuotationService,
    QuotationMetaDataService,
    QuotationUploadService,
    QuotationSequenceService,
    ArticleQuotationEntryService,
    ArticleQuotationEntryTaxService,
  ],
  exports: [QuotationService],
  imports: [
    //repositories
    QuotationRepository,
    //entities
    ArticleModule,
    AppConfigModule,
    BankAccountModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
    InvoiceModule,
    TaxModule,
    //abstract modules
    PdfModule,
    GatewaysModule,
    CalculationsModule,
    StorageModule,
  ],
})
export class QuotationModule {}
