import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaymentConditionEntity } from '../entity/payment-condition.entity';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentConditionRepository extends DatabaseAbstractRepostitory<PaymentConditionEntity> {
  constructor(
    @InjectRepository(PaymentConditionEntity)
    private readonly paymentConditionRepository: Repository<PaymentConditionEntity>,
  ) {
    super(paymentConditionRepository);
  }
}
