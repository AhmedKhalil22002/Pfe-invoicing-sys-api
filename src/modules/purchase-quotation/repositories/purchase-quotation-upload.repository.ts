import { Repository } from 'typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseQuotationStorageEntity } from '../entities/purchase-quotation-file.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class PurchaseQuotationUploadRepository extends DatabaseAbstractRepository<PurchaseQuotationStorageEntity> {
  constructor(
    @InjectRepository(PurchaseQuotationStorageEntity)
    private readonly purchaseQuotationUploadRespository: Repository<PurchaseQuotationStorageEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(purchaseQuotationUploadRespository, txHost);
  }
}
