import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { Connection } from 'typeorm';
import { taxes } from '../data/tax.data';

@Injectable()
export class MigrationTaxSeed {
  constructor(
    private readonly taxService: TaxService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:tax',
    describe: 'seeds taxes',
  })
  async seeds(): Promise<void> {
    try {
      await this.taxService.saveMany(taxes);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:tax',
    describe: 'rollback taxes',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.taxService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
