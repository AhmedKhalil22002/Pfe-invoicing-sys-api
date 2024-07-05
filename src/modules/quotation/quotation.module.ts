import { Module } from '@nestjs/common';
import { QuotationService } from './services/quotation.service';
import { QuotationRepositoryModule } from './repositories/quotation.repository.module';

@Module({
  controllers: [],
  providers: [QuotationService],
  exports: [QuotationService],
  imports: [QuotationRepositoryModule],
})
export class QuotationModule {}
