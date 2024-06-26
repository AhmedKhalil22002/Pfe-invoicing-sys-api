import { Module } from '@nestjs/common';
import { PaymentMethodService } from './services/payment-method.service';
import { PaymentMethodRepositoryModule } from './repositories/payment-method.repository.module';

@Module({
  controllers: [],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
  imports: [PaymentMethodRepositoryModule],
})
export class PaymentMethodModule {}
