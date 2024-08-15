import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/common/database/services/database-config.service';
import { MigrationActivitySeed } from './seeders/migration.activity.seed';
import { MigrationCountrySeed } from './seeders/migration.country.seed';
import { MigrationCurrencySeed } from './seeders/migration.currency.seed';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { CountryModule } from 'src/modules/country/country.module';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { TaxModule } from 'src/modules/tax/tax.module';
import { MigrationTaxSeed } from './seeders/migration.tax.seed';
import { MigrationCabinetSeed } from './seeders/test/migration.cabinet.seed';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { MigrationSchemaCommand } from './commands/migrations.schema.command';
import { PaymentConditionModule } from 'src/modules/payment-condition/payment-condition.module';
import { MigrationPaymentConditionSeed } from './seeders/migration.payment-method.seed';
import { MigrationQuotationSeed } from './seeders/test/migration.quotation.seed';
import { QuotationModule } from 'src/modules/quotation/quotation.module';
import { FirmModule } from 'src/modules/firm/firm.module';
import { MigrationFirmSeed } from './seeders/test/migration.firm.seed';
import { AppConfigModule } from 'src/common/app-config/app-config.module';
import { MigrationSequentialSeed } from './seeders/migration.sequential.seed';

@Module({
  imports: [
    CommandModule,
    ActivityModule,
    AppConfigModule,
    CabinetModule,
    CountryModule,
    CurrencyModule,
    FirmModule,
    PaymentConditionModule,
    QuotationModule,
    TaxModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: !process.env.NODE_ENV
        ? '.env'
        : `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [
    MigrationActivitySeed,
    MigrationCabinetSeed,
    MigrationCountrySeed,
    MigrationCurrencySeed,
    MigrationFirmSeed,
    MigrationPaymentConditionSeed,
    MigrationTaxSeed,
    MigrationQuotationSeed,
    MigrationSchemaCommand,
    MigrationSequentialSeed,
  ],
  exports: [],
})
export class MigrationModule {}
