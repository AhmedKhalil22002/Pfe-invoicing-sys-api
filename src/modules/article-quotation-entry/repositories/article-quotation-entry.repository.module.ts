import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleQuotationEntryRepository } from './repository/article-quotation-entry.repository';
import { ArticleQuotationEntryEntity } from './entities/article-quotation-entry.entity';

@Module({
  controllers: [],
  providers: [ArticleQuotationEntryRepository],
  exports: [ArticleQuotationEntryRepository],
  imports: [TypeOrmModule.forFeature([ArticleQuotationEntryEntity])],
})
export class ArticleQuotationEntryRepositoryModule {}
