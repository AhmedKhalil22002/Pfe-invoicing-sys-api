import { Module } from '@nestjs/common';
import { FirmService } from './services/firm.service';
import { FirmRepositoryModule } from './repositories/firm.repository.module';
import { InterlocutorModule } from '../interlocutor/Interlocutor.module';
import { AddressModule } from '../address/address.module';
import { CurrencyModule } from '../currency/currency.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  controllers: [],
  providers: [FirmService],
  exports: [FirmService],
  imports: [
    FirmRepositoryModule,
    ActivityModule,
    AddressModule,
    CurrencyModule,
    InterlocutorModule,
  ],
})
export class FirmModule {}
