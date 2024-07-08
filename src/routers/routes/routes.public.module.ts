import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivityController } from 'src/modules/activity/controllers/activity.controller';
import { AddressModule } from 'src/modules/address/address.module';
import { AddressController } from 'src/modules/address/controllers/address.controller';
import { BankAccountModule } from 'src/modules/bank-account/bank-account.module';
import { BankAccountController } from 'src/modules/bank-account/controllers/bank-account.controller';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { CabinetController } from 'src/modules/cabinet/controllers/cabinet.controller';
import { CountryController } from 'src/modules/country/controllers/country.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { CurrencyController } from 'src/modules/currency/controllers/currency.controller';
import { CurrencyModule } from 'src/modules/currency/currency.module';
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
    BankAccountController,
    CabinetController,
    CountryController,
    CurrencyController,
    FirmController,
    InterlocutorController,
    PaymentConditionController,
    QuotationController,
    TaxController,
  ],
  providers: [],
  exports: [],
  imports: [
    ActivityModule,
    AddressModule,
    BankAccountModule,
    CabinetModule,
    CountryModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
    PaymentConditionModule,
    QuotationModule,
    TaxModule,
  ],
})
export class RoutesPublicModule {}
