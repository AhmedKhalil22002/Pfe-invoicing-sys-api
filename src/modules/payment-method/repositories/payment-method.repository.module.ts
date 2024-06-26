import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodRepository } from './repository/payment-method.repository';
import { PaymentMethodEntity } from './entity/payment-method.entity';

@Module({
  controllers: [],
  providers: [PaymentMethodRepository],
  exports: [PaymentMethodRepository],
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
})
export class PaymentMethodRepositoryModule {}
