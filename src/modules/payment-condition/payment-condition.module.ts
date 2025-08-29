import { Module } from '@nestjs/common';
import { PaymentConditionService } from './services/payment-condition.service';
import { PaymentConditionRepository } from './repositories/repository/payment-condition.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentConditionEntity } from './repositories/entity/payment-condition.entity';

@Module({
  controllers: [],
  providers: [PaymentConditionRepository,PaymentConditionService],
  exports: [PaymentConditionRepository,PaymentConditionService],
  imports: [TypeOrmModule.forFeature([PaymentConditionEntity])],
})
export class PaymentConditionModule {}
