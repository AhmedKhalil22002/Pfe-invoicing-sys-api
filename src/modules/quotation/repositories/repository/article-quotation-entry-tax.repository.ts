import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleQuotationEntryTaxEntity } from '../entities/article-quotation-entry-tax.entity';

@Injectable()
export class ArticleQuotationEntryTaxRepository extends DatabaseAbstractRepostitory<ArticleQuotationEntryTaxEntity> {
  constructor(
    @InjectRepository(ArticleQuotationEntryTaxEntity)
    private readonly articleQuotationEntryTaxRepository: Repository<ArticleQuotationEntryTaxEntity>,
  ) {
    super(articleQuotationEntryTaxRepository);
  }
}
