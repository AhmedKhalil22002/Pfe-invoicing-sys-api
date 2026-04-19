import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ArticlePurchaseInvoiceEntryEntity } from '../entities/article-purchase-invoice-entry.entity';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';

@Injectable()
export class ArticlePurchaseInvoiceEntryRepository extends DatabaseAbstractRepository<ArticlePurchaseInvoiceEntryEntity> {
  constructor(
    @InjectRepository(ArticlePurchaseInvoiceEntryEntity)
    private readonly articlePurchaseInvoiceEntryRepository: Repository<ArticlePurchaseInvoiceEntryEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(articlePurchaseInvoiceEntryRepository, txHost);
  }
}
