import { Module } from '@nestjs/common';
import { FirmService } from './services/firm.service';
import { FirmRepositoryModule } from './repositories/firm.repository.module';

@Module({
  controllers: [],
  providers: [FirmService],
  exports: [FirmService],
  imports: [FirmRepositoryModule],
})
export class FirmModule {}
