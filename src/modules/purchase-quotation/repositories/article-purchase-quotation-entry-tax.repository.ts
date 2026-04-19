import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlePurchaseQuotationEntryTaxEntity } from '../entities/article-purchase-quotation-entry-tax.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class ArticlePurchaseQuotationEntryTaxRepository extends DatabaseAbstractRepository<ArticlePurchaseQuotationEntryTaxEntity> {
  constructor(
    @InjectRepository(ArticlePurchaseQuotationEntryTaxEntity)
    private readonly articlePurchaseQuotationEntryTaxRepository: Repository<ArticlePurchaseQuotationEntryTaxEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(articlePurchaseQuotationEntryTaxRepository, txHost);
  }
}
