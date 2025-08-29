import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { InvoiceUploadEntity } from '../entities/invoice-file.entity';
import { DatabaseAbstractRepository } from 'src/shared/database-v2/repositories/database.repository';

@Injectable()
export class InvoiceUploadRepository extends DatabaseAbstractRepository<InvoiceUploadEntity> {
  constructor(
    @InjectRepository(InvoiceUploadEntity)
    private readonly invoiceUploadRespository: Repository<InvoiceUploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(invoiceUploadRespository, txHost);
  }
}
