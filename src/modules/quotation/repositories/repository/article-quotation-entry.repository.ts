import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleQuotationEntryEntity } from '../entities/article-quotation-entry.entity';

@Injectable()
export class ArticleQuotationEntryRepository extends DatabaseAbstractRepostitory<ArticleQuotationEntryEntity> {
  constructor(
    @InjectRepository(ArticleQuotationEntryEntity)
    private readonly articleQuotationEntryRepository: Repository<ArticleQuotationEntryEntity>,
  ) {
    super(articleQuotationEntryRepository);
  }
}
