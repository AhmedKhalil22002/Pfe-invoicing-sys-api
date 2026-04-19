import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ArticlePurchaseInvoiceEntryTaxEntity } from '../entities/article-purchase-invoice-entry-tax.entity';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';

@Injectable()
export class ArticlePurchaseInvoiceEntryTaxRepository extends DatabaseAbstractRepository<ArticlePurchaseInvoiceEntryTaxEntity> {
  constructor(
    @InjectRepository(ArticlePurchaseInvoiceEntryTaxEntity)
    private readonly articlePurchaseInvoiceEntryTaxRepository: Repository<ArticlePurchaseInvoiceEntryTaxEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(articlePurchaseInvoiceEntryTaxRepository, txHost);
  }
}
