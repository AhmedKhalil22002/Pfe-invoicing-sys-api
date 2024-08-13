import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { Connection } from 'typeorm';
import { AppConfigService } from 'src/common/app-config/services/app-config.service';
import { sequential } from '../data/sequential.data';

@Injectable()
export class MigrationSequentialSeed {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:sequential',
    describe: 'seeds sequential numbers',
  })
  async seeds(): Promise<void> {
    try {
      await this.appConfigService.saveMany(sequential);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:sequential',
    describe: 'rollback sequential numbers',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.appConfigService.deleteManyByName(
        sequential.map((s) => s.name),
      );
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
