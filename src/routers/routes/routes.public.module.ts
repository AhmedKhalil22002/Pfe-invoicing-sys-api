import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivityController } from 'src/modules/activity/controllers/activity.controller';
import { AddressModule } from 'src/modules/address/address.module';
import { AddressController } from 'src/modules/address/controllers/address.controller';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { CabinetController } from 'src/modules/cabinet/controllers/cabinet.controller';
import { CountryController } from 'src/modules/country/controllers/country.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { CurrencyController } from 'src/modules/currency/controllers/currency.controller';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { TaxController } from 'src/modules/tax/controllers/tax.controller';
import { TaxModule } from 'src/modules/tax/tax.module';

@Module({
  controllers: [
    ActivityController,
    AddressController,
    CabinetController,
    CountryController,
    CurrencyController,
    TaxController,
  ],
  providers: [],
  exports: [],
  imports: [
    ActivityModule,
    AddressModule,
    CabinetModule,
    CountryModule,
    CurrencyModule,
    TaxModule,
  ],
})
export class RoutesPublicModule {}
