import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { currencies } from '../data/currency.data';
import { CurrencyService } from 'src/modules/currency/services/currency.service';

@Injectable()
export class MigrationCurrencySeed {
  constructor(private readonly currencyService: CurrencyService) {}

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
    describe: 'rollback currency',
  })
  async remove(): Promise<void> {
    try {
      await this.currencyService.deleteAll();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
