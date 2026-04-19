import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { PurchaseInvoiceMetaDataEntity } from '../entities/purchase-invoice-meta-data.entity';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';

@Injectable()
export class PurchaseInvoiceMetaDataRepository extends DatabaseAbstractRepository<PurchaseInvoiceMetaDataEntity> {
  constructor(
    @InjectRepository(PurchaseInvoiceMetaDataEntity)
    private readonly purchaseInvoiceMetaDataRepository: Repository<PurchaseInvoiceMetaDataEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(purchaseInvoiceMetaDataRepository, txHost);
  }
}
