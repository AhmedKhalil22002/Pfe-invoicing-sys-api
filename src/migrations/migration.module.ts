import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CommonModule } from 'src/common/common.module';
import { MigrationCountrySeed } from './seeders/migration.country.seed';
import { CountryModule } from 'src/modules/country/country.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/common/database/services/database-config.service';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs';
import { MigrationCurrencySeed } from './seeders/migration.currency.seed';
import { CurrencyModule } from 'src/modules/currency/currency.module';

@Module({
  imports: [
    CommonModule,
    CommandModule,
    CountryModule,
    CurrencyModule,
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
  providers: [MigrationCountrySeed, MigrationCurrencySeed],
  exports: [],
})
export class MigrationModule {}
