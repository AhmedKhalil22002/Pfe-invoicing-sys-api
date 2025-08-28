import { Module } from '@nestjs/common';
import { TaxService } from './services/tax.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxEntity } from './entities/tax.entity';
import { TaxRepository } from './repositories/tax.repository';

@Module({
  controllers: [],
  providers: [TaxRepository, TaxService],
  exports: [TaxRepository, TaxService],
  imports: [TypeOrmModule.forFeature([TaxEntity])],
})
export class TaxModule {}
