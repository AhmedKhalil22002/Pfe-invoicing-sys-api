import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { BankAccountRepository } from '../repositories/repository/bank-account.repository';
import { BankAccountEntity } from '../repositories/entities/bank-account.entity';
import { BankAccountNotFoundException } from '../errors/bank-account.notfound.error';
import { ResponseBankAccountDto } from '../dtos/bank-account.response.dto';
import { CreateBankAccountDto } from '../dtos/bank-account.create.dto';
import { UpdateBankAccountDto } from '../dtos/bank-account.update.dto';
import { BankAccountAlreadyExistsException } from '../errors/bank-account.alreadyexists.error';
import { getSelectAndRelations } from 'src/common/database/utils/selectAndRelations';

@Injectable()
export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async findOneById(id: number): Promise<BankAccountEntity> {
    const bankAccount = await this.bankAccountRepository.findOneById(id);
    if (!bankAccount) {
      throw new BankAccountNotFoundException();
    }
    return bankAccount;
  }

  async isBankAccountExists(
    bankAccount: Partial<BankAccountEntity>,
  ): Promise<boolean> {
    const existingBankAccount = await this.bankAccountRepository.findOne({
      where: {
        iban: bankAccount.iban,
        rib: bankAccount.rib,
        deletedAt: null,
      },
    });
    return !!existingBankAccount;
  }

  async findOneByCondition(
    options: QueryOptions<ResponseBankAccountDto>,
  ): Promise<BankAccountEntity | null> {
    const bankAccount = await this.bankAccountRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!bankAccount) return null;
    return bankAccount;
  }

  async findAll(): Promise<BankAccountEntity[]> {
    return await this.bankAccountRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseBankAccountDto>,
  ): Promise<PageDto<BankAccountEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options || {};

    const where = buildWhereClause<ResponseBankAccountDto>(
      filters,
      strictMatching,
    );
    const count = await this.bankAccountRepository.getTotalCount({ where });

    const { select, relations } = getSelectAndRelations(
      await this.bankAccountRepository.getRelatedEntityNames(),
      options,
    );

    const entities = await this.bankAccountRepository.findAll({
      select,
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
      relations,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountEntity> {
    if (await this.isBankAccountExists(createBankAccountDto)) {
      throw new BankAccountAlreadyExistsException();
    }
    return this.bankAccountRepository.save(createBankAccountDto);
  }

  async saveMany(
    createBankAccountDto: CreateBankAccountDto[],
  ): Promise<BankAccountEntity[]> {
    for (const dto of createBankAccountDto) {
      if (await this.isBankAccountExists(dto)) {
        throw new BankAccountAlreadyExistsException();
      }
    }
    return this.bankAccountRepository.saveMany(createBankAccountDto);
  }

  async update(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccountEntity> {
    if (!(await this.isBankAccountExists(updateBankAccountDto))) {
      throw new BankAccountNotFoundException();
    }
    const existingBankAccount = await this.findOneById(id);
    return this.bankAccountRepository.save({
      ...existingBankAccount,
      ...updateBankAccountDto,
    });
  }

  async softDelete(id: number): Promise<BankAccountEntity> {
    await this.findOneById(id);
    return this.bankAccountRepository.softDelete(id);
  }

  async deleteAll() {
    return this.bankAccountRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.bankAccountRepository.getTotalCount();
  }
}
