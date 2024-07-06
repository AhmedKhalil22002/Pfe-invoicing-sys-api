import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { Connection } from 'typeorm';
import { FirmService } from 'src/modules/firm/services/firm.service';
import { firms } from 'src/migrations/data/test/firm.data';

@Injectable()
export class MigrationFirmSeed {
  constructor(
    private readonly firmService: FirmService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:firm',
    describe: 'seeds firm',
  })
  async seeds(): Promise<void> {
    try {
      await this.firmService.saveMany(firms);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:firm',
    describe: 'rollback firm',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.firmService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
