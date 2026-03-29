import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { BankAccountEntity } from '../entities/bank-account.entity';
import { BankAccountRepository } from '../repositories/bank-account.repository';

export class BankAccountService extends AbstractCrudService<BankAccountEntity> {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {
    super(bankAccountRepository);
  }
}
