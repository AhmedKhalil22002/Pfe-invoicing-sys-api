import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { BankAccountEntity } from '../entities/bank-account.entity';
import { DatabaseAbstractRepository } from 'src/shared/database-v2/repositories/database.repository';

@Injectable()
export class BankAccountRepository extends DatabaseAbstractRepository<BankAccountEntity> {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountRepository: Repository<BankAccountEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(bankAccountRepository, txHost);
  }
}
