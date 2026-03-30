import { Injectable } from '@nestjs/common';
import { BankAccountRepository } from '../repositories/bank-account.repository';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { BankAccountEntity } from '../entities/bank-account.entity';

@Injectable()
export class BankAccountService extends AbstractCrudService<BankAccountEntity> {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {
    super(bankAccountRepository);
  }
}
