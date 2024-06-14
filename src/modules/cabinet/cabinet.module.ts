import { Module } from '@nestjs/common';
import { CabinetService } from './services/cabinet.service';
import { CabinetRepositoryModule } from './repositories/cabinet.repository.module';

@Module({
  controllers: [],
  providers: [CabinetService],
  exports: [CabinetService],
  imports: [CabinetRepositoryModule],
})
export class CabinetModule {}
