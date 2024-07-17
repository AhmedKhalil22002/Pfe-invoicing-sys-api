import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleQuotationEntryRepository } from './repository/article-quotation-entry.repository';
import { ArticleQuotationEntryEntity } from './entities/article-quotation-entry.entity';
import { ArticleQuotationEntryTaxRepository } from './repository/article-quotation-entry-tax.repository';
import { ArticleQuotationEntryTaxEntity } from './entities/article-quotation-entry-tax.entity';

@Module({
  controllers: [],
  providers: [
    ArticleQuotationEntryRepository,
    ArticleQuotationEntryTaxRepository,
  ],
  exports: [
    ArticleQuotationEntryRepository,
    ArticleQuotationEntryTaxRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([ArticleQuotationEntryEntity]),
    TypeOrmModule.forFeature([ArticleQuotationEntryTaxEntity]),
  ],
})
export class ArticleQuotationEntryRepositoryModule {}
