import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentUploadService } from './services/payment-upload.service';
import { PaymentInvoiceEntryService } from './services/payment-invoice-entry.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { CurrencyModule } from '../currency/currency.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentInvoiceEntryEntity } from './entities/payment-invoice-entry.entity';
import { PaymentUploadEntity } from './entities/payment-file.entity';
import { PaymentRepository } from './repositories/payment-file.repository';
import { PaymentInvoiceEntryRepository } from './repositories/payment-invoice-entry.repository';
import { PaymentUploadRepository } from './repositories/payment.repository';
import { UploadModule } from 'src/shared/uploads/uploads.module';

@Module({
  controllers: [],
  providers: [
    PaymentRepository,
    PaymentInvoiceEntryRepository,
    PaymentUploadRepository,
    PaymentService,
    PaymentUploadService,
    PaymentInvoiceEntryService,
  ],
  exports: [
    PaymentRepository,
    PaymentInvoiceEntryRepository,
    PaymentUploadRepository,
    PaymentService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      PaymentInvoiceEntryEntity,
      PaymentUploadEntity,
    ]),

    CurrencyModule,
    InvoiceModule,
    UploadModule,
  ],
})
export class PaymentModule {}
