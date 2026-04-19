import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseQuotationService } from './services/purchase-quotation.service';
import { CurrencyModule } from '../currency/currency.module';
import { FirmModule } from '../firm/firm.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';
import { ArticlePurchaseQuotationEntryService } from './services/article-purchase-quotation-entry.service';
import { ArticlePurchaseQuotationEntryTaxService } from './services/article-purchase-quotation-entry-tax.service';
import { TaxModule } from '../tax/tax.module';
import { ArticleModule } from '../article/article.module';
import { PdfModule } from 'src/shared/pdf/pdf.module';
import { CalculationsModule } from 'src/shared/calculations/calculations.module';
import { PurchaseQuotationSequenceService } from './services/purchase-quotation-sequence.service';
import { GatewaysModule } from 'src/shared/gateways/gateways.module';
import { PurchaseQuotationMetaDataService } from './services/purchase-quotation-meta-data.service';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { PurchaseQuotationStorageService } from './services/purchase-quotation-upload.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { PurchaseQuotationEntity } from './entities/purchase-quotation.entity';
import { PurchaseQuotationMetaDataEntity } from './entities/purchase-quotation-meta-data.entity';
import { ArticlePurchaseQuotationEntryEntity } from './entities/article-purchase-quotation-entry.entity';
import { ArticlePurchaseQuotationEntryTaxEntity } from './entities/article-purchase-quotation-entry-tax.entity';
import { PurchaseQuotationStorageEntity } from './entities/purchase-quotation-file.entity';
import { PurchaseQuotationRepository } from './repositories/purchase-quotation.repository';
import { PurchaseQuotationMetaDataRepository } from './repositories/purchase-quotation-meta-data-repository';
import { ArticlePurchaseQuotationEntryRepository } from './repositories/article-purchase-quotation-entry.repository';
import { ArticlePurchaseQuotationEntryTaxRepository } from './repositories/article-purchase-quotation-entry-tax.repository';
import { PurchaseQuotationUploadRepository } from './repositories/purchase-quotation-upload.repository';
import { StorageModule } from 'src/shared/storage/storage.module';
import { SequenceModule } from '../sequence/sequence.module';

@Module({
  controllers: [],
  providers: [
    // Repositories
    PurchaseQuotationRepository,
    PurchaseQuotationMetaDataRepository,
    ArticlePurchaseQuotationEntryRepository,
    ArticlePurchaseQuotationEntryTaxRepository,
    PurchaseQuotationUploadRepository,
    // Services
    PurchaseQuotationService,
    PurchaseQuotationMetaDataService,
    PurchaseQuotationStorageService,
    PurchaseQuotationSequenceService,
    ArticlePurchaseQuotationEntryService,
    ArticlePurchaseQuotationEntryTaxService,
  ],
  exports: [PurchaseQuotationRepository, PurchaseQuotationService],
  imports: [
    // TypeORM Entities
    TypeOrmModule.forFeature([
      PurchaseQuotationEntity,
      PurchaseQuotationMetaDataEntity,
      ArticlePurchaseQuotationEntryEntity,
      ArticlePurchaseQuotationEntryTaxEntity,
      PurchaseQuotationStorageEntity,
    ]),
    ArticleModule,
    SequenceModule,
    BankAccountModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
    InvoiceModule,
    TaxModule,
    PdfModule,
    GatewaysModule,
    CalculationsModule,
    StorageModule,
  ],
})
export class PurchaseQuotationModule {}
