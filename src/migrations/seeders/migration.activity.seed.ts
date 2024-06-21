import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { activities } from '../data/activity.data';
import { Connection } from 'typeorm';

@Injectable()
export class MigrationActivitySeed {
  constructor(
    private readonly activityService: ActivityService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:activity',
    describe: 'seeds activities',
  })
  async seeds(): Promise<void> {
    try {
      await this.activityService.saveMany(
        activities.map((activity) => ({
          label: activity,
        })),
      );
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:activity',
    describe: 'rollback activities',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.activityService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
