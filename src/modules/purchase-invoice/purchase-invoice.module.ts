import { Module } from '@nestjs/common';
import { CurrencyModule } from '../currency/currency.module';
import { FirmModule } from '../firm/firm.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';
import { TaxModule } from '../tax/tax.module';
import { ArticleModule } from '../article/article.module';
import { PdfModule } from 'src/shared/pdf/pdf.module';
import { CalculationsModule } from 'src/shared/calculations/calculations.module';
import { AppConfigModule } from 'src/shared/app-config/app-config.module';
import { GatewaysModule } from 'src/shared/gateways/gateways.module';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { PurchaseInvoiceService } from './services/purchase-invoice.service';
import { PurchaseInvoiceMetaDataService } from './services/purchase-invoice-meta-data.service';
import { PurchaseInvoiceStorageService } from './services/purchase-invoice-upload.service';
import { PurchaseInvoiceSequenceService } from './services/purchase-invoice-sequence.service';
import { ArticlePurchaseInvoiceEntryService } from './services/article-purchase-invoice-entry.service';
import { ArticlePurchaseInvoiceEntryTaxService } from './services/article-purchase-invoice-entry-tax.service';
import { TaxWithholdingModule } from '../tax-withholding/tax-withholding.module';
import { PurchaseInvoiceRepository } from './repositories/purchase-invoice.repository';
import { PurchaseInvoiceMetaDataRepository } from './repositories/purchase-invoice-meta-data.repository';
import { PurchaseInvoiceUploadRepository } from './repositories/purchase-invoice-upload.repository';
import { ArticlePurchaseInvoiceEntryRepository } from './repositories/article-purchase-invoice-entry.repository';
import { ArticlePurchaseInvoiceEntryTaxRepository } from './repositories/article-purchase-invoice-entry-tax.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseInvoiceEntity } from './entities/purchase-invoice.entity';
import { ArticlePurchaseInvoiceEntryTaxEntity } from './entities/article-purchase-invoice-entry-tax.entity';
import { ArticlePurchaseInvoiceEntryEntity } from './entities/article-purchase-invoice-entry.entity';
import { PurchaseInvoiceStorageEntity } from './entities/purchase-invoice-file.entity';
import { PurchaseInvoiceMetaDataEntity } from './entities/purchase-invoice-meta-data.entity';
import { SequenceModule } from '../sequence/sequence.module';
import { StorageModule } from 'src/shared/storage/storage.module';
import { PurchaseInvoiceController } from './controllers/purchase-invoice.controller';

@Module({
  controllers: [PurchaseInvoiceController],
  providers: [
    PurchaseInvoiceRepository,
    PurchaseInvoiceMetaDataRepository,
    PurchaseInvoiceUploadRepository,
    ArticlePurchaseInvoiceEntryRepository,
    ArticlePurchaseInvoiceEntryTaxRepository,

    PurchaseInvoiceService,
    PurchaseInvoiceMetaDataService,
    PurchaseInvoiceStorageService,
    PurchaseInvoiceSequenceService,
    ArticlePurchaseInvoiceEntryService,
    ArticlePurchaseInvoiceEntryTaxService,
  ],
  exports: [
    PurchaseInvoiceRepository,
    PurchaseInvoiceMetaDataRepository,
    PurchaseInvoiceUploadRepository,
    ArticlePurchaseInvoiceEntryRepository,
    ArticlePurchaseInvoiceEntryTaxRepository,
    PurchaseInvoiceService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      PurchaseInvoiceEntity,
      ArticlePurchaseInvoiceEntryTaxEntity,
      ArticlePurchaseInvoiceEntryEntity,
      PurchaseInvoiceStorageEntity,
      PurchaseInvoiceMetaDataEntity,
    ]),

    //entities
    ArticleModule,
    AppConfigModule,
    BankAccountModule,
    LoggerModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
    TaxModule,
    TaxWithholdingModule,
    SequenceModule,
    StorageModule,
    //abstract modules
    PdfModule,
    GatewaysModule,
    CalculationsModule,
    StorageModule,
  ],
})
export class PurchaseInvoiceModule {}
