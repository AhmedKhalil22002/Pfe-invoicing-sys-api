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

@Module({
  imports: [
    CommandModule,
    ActivityModule,
    CountryModule,
    CurrencyModule,
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
    MigrationCountrySeed,
    MigrationCurrencySeed,
    MigrationTaxSeed,
  ],
  exports: [],
})
export class MigrationModule {}
