import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { PaymentUploadEntity } from '../entities/payment-file.entity';
import { DatabaseAbstractRepository } from 'src/shared/database-v2/repositories/database.repository';

@Injectable()
export class PaymentUploadRepository extends DatabaseAbstractRepository<PaymentUploadEntity> {
  constructor(
    @InjectRepository(PaymentUploadEntity)
    private readonly paymentUploadRepository: Repository<PaymentUploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(paymentUploadRepository, txHost);
  }
}
