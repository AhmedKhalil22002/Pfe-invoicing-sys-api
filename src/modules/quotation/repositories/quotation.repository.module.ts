import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationEntity } from './entities/quotation.entity';
import { QuotationRepository } from './repository/quotation.repository';

@Module({
  controllers: [],
  providers: [QuotationRepository],
  exports: [QuotationRepository],
  imports: [TypeOrmModule.forFeature([QuotationEntity])],
})
export class QuotationRepositoryModule {}
