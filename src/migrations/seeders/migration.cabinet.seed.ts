import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { CabinetService } from 'src/modules/cabinet/services/cabinet.service';
import { cabinet } from '../data/cabinet.data';
import { Connection } from 'typeorm';

@Injectable()
export class MigrationCabinetSeed {
  constructor(
    private readonly cabinetService: CabinetService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:cabinet',
    describe: 'seeds cabinet',
  })
  async seeds(): Promise<void> {
    try {
      await this.cabinetService.save(cabinet);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:cabinet',
    describe: 'rollback cabinet',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.cabinetService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
