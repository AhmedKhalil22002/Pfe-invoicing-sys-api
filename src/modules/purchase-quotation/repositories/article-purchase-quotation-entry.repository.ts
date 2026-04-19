import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlePurchaseQuotationEntryEntity } from '../entities/article-purchase-quotation-entry.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class ArticlePurchaseQuotationEntryRepository extends DatabaseAbstractRepository<ArticlePurchaseQuotationEntryEntity> {
  constructor(
    @InjectRepository(ArticlePurchaseQuotationEntryEntity)
    private readonly articlePurchaseQuotationEntryRepository: Repository<ArticlePurchaseQuotationEntryEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(articlePurchaseQuotationEntryRepository, txHost);
  }
}
