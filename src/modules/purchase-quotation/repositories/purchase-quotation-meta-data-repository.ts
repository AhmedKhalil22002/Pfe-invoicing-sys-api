import { Repository } from 'typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseQuotationMetaDataEntity } from '../entities/purchase-quotation-meta-data.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class PurchaseQuotationMetaDataRepository extends DatabaseAbstractRepository<PurchaseQuotationMetaDataEntity> {
  constructor(
    @InjectRepository(PurchaseQuotationMetaDataEntity)
    private readonly purchaseQuotationMetaDataRespository: Repository<PurchaseQuotationMetaDataEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(purchaseQuotationMetaDataRespository, txHost);
  }
}
