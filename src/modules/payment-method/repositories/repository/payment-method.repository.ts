import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodEntity } from '../entity/payment-method.entity';

@Injectable()
export class PaymentMethodRepository extends DatabaseAbstractRepostitory<PaymentMethodEntity> {
  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
  ) {
    super(paymentMethodRepository);
  }
}
