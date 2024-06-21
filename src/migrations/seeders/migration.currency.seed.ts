import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { currencies } from '../data/currency.data';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { Connection } from 'typeorm';

@Injectable()
export class MigrationCurrencySeed {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:currency',
    describe: 'seeds currency',
  })
  async seeds(): Promise<void> {
    try {
      await this.currencyService.saveMany(currencies);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:currency',
    describe: 'rollback currencies',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.currencyService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
