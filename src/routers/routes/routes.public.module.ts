import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/app-config/app-config.module';
import { AppConfigController } from 'src/common/app-config/controllers/app-config.controller';
import { StorageController } from 'src/common/storage/controllers/storage.controller';
import { StorageModule } from 'src/common/storage/storage.module';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivityController } from 'src/modules/activity/controllers/activity.controller';
import { AddressModule } from 'src/modules/address/address.module';
import { AddressController } from 'src/modules/address/controllers/address.controller';
import { ArticleModule } from 'src/modules/article/article.module';
import { ArticleController } from 'src/modules/article/controllers/article.controller';
import { BankAccountModule } from 'src/modules/bank-account/bank-account.module';
import { BankAccountController } from 'src/modules/bank-account/controllers/bank-account.controller';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { CabinetController } from 'src/modules/cabinet/controllers/cabinet.controller';
import { CountryController } from 'src/modules/country/controllers/country.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { CurrencyController } from 'src/modules/currency/controllers/currency.controller';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { FirmInterlocutorEntryController } from 'src/modules/firm-interlocutor-entry/controllers/firm-interlocutor-entry.controller.ts';
import { FirmInterlocutorEntryModule } from 'src/modules/firm-interlocutor-entry/firm-interlocutor-entry.module';
import { FirmController } from 'src/modules/firm/controllers/firm.controller';
import { FirmModule } from 'src/modules/firm/firm.module';
import { InterlocutorModule } from 'src/modules/interlocutor/Interlocutor.module';
import { InterlocutorController } from 'src/modules/interlocutor/controllers/interlocutor.controller';
import { PaymentConditionController } from 'src/modules/payment-condition/controllers/payment-condition.controller';
import { PaymentConditionModule } from 'src/modules/payment-condition/payment-condition.module';
import { QuotationController } from 'src/modules/quotation/controllers/quotation.controller';
import { QuotationModule } from 'src/modules/quotation/quotation.module';
import { TaxController } from 'src/modules/tax/controllers/tax.controller';
import { TaxModule } from 'src/modules/tax/tax.module';

@Module({
  controllers: [
    ActivityController,
    AddressController,
    ArticleController,
    AppConfigController,
    BankAccountController,
    CabinetController,
    CountryController,
    CurrencyController,
    FirmController,
    FirmInterlocutorEntryController,
    InterlocutorController,
    PaymentConditionController,
    QuotationController,
    StorageController,
    TaxController,
  ],
  providers: [],
  exports: [],
  imports: [
    ActivityModule,
    AddressModule,
    ArticleModule,
    AppConfigModule,
    BankAccountModule,
    CabinetModule,
    CountryModule,
    CurrencyModule,
    FirmModule,
    FirmInterlocutorEntryModule,
    InterlocutorModule,
    PaymentConditionModule,
    QuotationModule,
    StorageModule,
    TaxModule,
  ],
})
export class RoutesPublicModule {}
