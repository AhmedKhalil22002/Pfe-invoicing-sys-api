import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { PurchaseInvoiceStorageEntity } from '../entities/purchase-invoice-file.entity';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';

@Injectable()
export class PurchaseInvoiceUploadRepository extends DatabaseAbstractRepository<PurchaseInvoiceStorageEntity> {
  constructor(
    @InjectRepository(PurchaseInvoiceStorageEntity)
    private readonly purchaseInvoiceUploadRepository: Repository<PurchaseInvoiceStorageEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(purchaseInvoiceUploadRepository, txHost);
  }
}
