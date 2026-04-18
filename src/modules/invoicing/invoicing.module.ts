import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationEntity } from './entities/quotation.entity';
import { QuotationRepository } from './repositories/quotation.repository';
import { QuotationService } from './services/quotation.service';

@Module({
  exports: [QuotationRepository, QuotationService],
  providers: [QuotationRepository, QuotationService],
  imports: [TypeOrmModule.forFeature([QuotationEntity])],
})
export class InvoicingModule {}
