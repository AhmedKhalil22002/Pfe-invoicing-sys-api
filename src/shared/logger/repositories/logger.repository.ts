import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { LoggerEntity } from '../entities/logger.entity';
import { DatabaseAbstractRepository } from 'src/shared/database-v2/repositories/database.repository';

@Injectable()
export class LoggerRepository extends DatabaseAbstractRepository<LoggerEntity> {
  constructor(
    @InjectRepository(LoggerEntity)
    private readonly loggerRepository: Repository<LoggerEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(loggerRepository, txHost);
  }
}
