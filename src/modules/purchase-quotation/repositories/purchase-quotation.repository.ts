import { Repository } from 'typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseQuotationEntity } from '../entities/purchase-quotation.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class PurchaseQuotationRepository extends DatabaseAbstractRepository<PurchaseQuotationEntity> {
  constructor(
    @InjectRepository(PurchaseQuotationEntity)
    private readonly purchaseQuotationRepository: Repository<PurchaseQuotationEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(purchaseQuotationRepository, txHost);
  }
}
