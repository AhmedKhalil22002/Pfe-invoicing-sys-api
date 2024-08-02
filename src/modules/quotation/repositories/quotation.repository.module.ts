import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationEntity } from './entities/quotation.entity';
import { QuotationRepository } from './repository/quotation.repository';
import { ArticleQuotationEntryRepository } from './repository/article-quotation-entry.repository';
import { ArticleQuotationEntryEntity } from './entities/article-quotation-entry.entity';
import { ArticleQuotationEntryTaxRepository } from './repository/article-quotation-entry-tax.repository';
import { ArticleQuotationEntryTaxEntity } from './entities/article-quotation-entry-tax.entity';

@Module({
  controllers: [],
  providers: [
    QuotationRepository,
    ArticleQuotationEntryRepository,
    ArticleQuotationEntryTaxRepository,
  ],
  exports: [
    QuotationRepository,
    ArticleQuotationEntryRepository,
    ArticleQuotationEntryTaxRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([QuotationEntity]),
    TypeOrmModule.forFeature([ArticleQuotationEntryEntity]),
    TypeOrmModule.forFeature([ArticleQuotationEntryTaxEntity]),
  ],
})
export class QuotationRepositoryModule {}
