import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from '../entities/bank-account.entity';

@Injectable()
export class BankAccountRepository extends DatabaseAbstractRepostitory<BankAccountEntity> {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountRepository: Repository<BankAccountEntity>,
  ) {
    super(bankAccountRepository);
  }
}
