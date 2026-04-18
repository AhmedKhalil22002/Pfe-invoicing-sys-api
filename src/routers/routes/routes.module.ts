import { Module } from '@nestjs/common';
import { PseudoQuotationController } from 'src/modules/invoicing/controllers/quotation.controller';
import { InvoicingModule } from 'src/modules/invoicing/invoicing.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [AuthController,PseudoQuotationController],
  imports: [AuthModule, LoggerModule, InvoicingModule],
})
export class RoutesModule {}
