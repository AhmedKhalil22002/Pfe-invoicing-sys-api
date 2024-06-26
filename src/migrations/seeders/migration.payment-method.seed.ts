import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { Connection } from 'typeorm';
import { PaymentConditionService } from 'src/modules/payment-condition/services/payment-condition.service';
import { paymentConditions } from '../data/payment-condition.data';

@Injectable()
export class MigrationPaymentConditionSeed {
  constructor(
    private readonly paymentConditionService: PaymentConditionService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:payment-condition',
    describe: 'seeds payment conditions',
  })
  async seeds(): Promise<void> {
    try {
      await this.paymentConditionService.saveMany(
        paymentConditions.map((paymentCondition) => {
          return {
            ...paymentCondition,
            isDeletionRestricted: true,
          };
        }),
      );
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:payment-condition',
    describe: 'rollback payment conditions',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.paymentConditionService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
