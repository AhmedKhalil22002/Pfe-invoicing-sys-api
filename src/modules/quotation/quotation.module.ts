import { Module } from '@nestjs/common';
import { QuotationService } from './services/quotation.service';
import { QuotationRepositoryModule } from './repositories/quotation.repository.module';
import { CurrencyModule } from '../currency/currency.module';
import { FirmModule } from '../firm/firm.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';

@Module({
  controllers: [],
  providers: [QuotationService],
  exports: [QuotationService],
  imports: [
    QuotationRepositoryModule,
    CurrencyModule,
    FirmModule,
    InterlocutorModule,
  ],
})
export class QuotationModule {}
