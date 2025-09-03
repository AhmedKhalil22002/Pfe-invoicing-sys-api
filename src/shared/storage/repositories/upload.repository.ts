import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { UploadEntity } from '../entities/upload.entity';
import { DatabaseAbstractRepository } from 'src/shared/database-v2/repositories/database.repository';

@Injectable()
export class UploadRepository extends DatabaseAbstractRepository<UploadEntity> {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(uploadRepository, txHost);
  }
}
