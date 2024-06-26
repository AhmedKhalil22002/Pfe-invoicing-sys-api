import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { Connection } from 'typeorm';
import { PaymentMethodService } from 'src/modules/payment-method/services/payment-method.service';
import { paymentMethods } from '../data/payment-method.data';

@Injectable()
export class MigrationPaymentMethodSeed {
  constructor(
    private readonly paymentMethodService: PaymentMethodService,
    private readonly connection: Connection,
  ) {}

  @Command({
    command: 'seed:payment-method',
    describe: 'seeds payment methods',
  })
  async seeds(): Promise<void> {
    try {
      await this.paymentMethodService.saveMany(paymentMethods);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:payment-method',
    describe: 'rollback payment methods',
  })
  async remove(): Promise<void> {
    try {
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await this.paymentMethodService.deleteAll();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
