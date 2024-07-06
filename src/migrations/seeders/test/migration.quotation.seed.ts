import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { Connection } from 'typeorm';
import { QuotationService } from 'src/modules/quotation/services/quotation.service';
import { quotations } from 'src/migrations/data/test/quotation.data';

@Injectable()
export class MigrationQuotationSeed {
  constructor(
    private readonly quotationService: QuotationService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:quotation',
    describe: 'seeds quotation',
  })
  async seeds(): Promise<void> {
    try {
      await this.quotationService.saveMany(quotations);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:quotation',
    describe: 'rollback currencies',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.quotationService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
