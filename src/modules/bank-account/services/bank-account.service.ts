import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { BankAccountRepository } from '../repositories/repository/bank-account.repository';
import { BankAccountEntity } from '../repositories/entities/bank-account.entity';
import { BankAccountNotFoundException } from '../errors/bank-account.notfound.error';
import { ResponseBankAccountDto } from '../dtos/bank-account.response.dto';
import { CreateBankAccountDto } from '../dtos/bank-account.create.dto';
import { UpdateBankAccountDto } from '../dtos/bank-account.update.dto';
import { BankAccountAlreadyExistsException } from '../errors/bank-account.alreadyexists.error';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryBuilder } from 'src/common/database/utils/database-query-builder';

@Injectable()
export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async findOneById(id: number): Promise<BankAccountEntity> {
    const account = await this.bankAccountRepository.findOneById(id);
    if (!account) {
      throw new BankAccountNotFoundException();
    }
    return account;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponseBankAccountDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const account = await this.bankAccountRepository.findOne(
      queryOptions as FindOneOptions<BankAccountEntity>,
    );
    if (!account) return null;
    return account;
  }

  async findAll(query: IQueryObject): Promise<ResponseBankAccountDto[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.bankAccountRepository.findAll(
      queryOptions as FindManyOptions<BankAccountEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponseBankAccountDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.bankAccountRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.bankAccountRepository.findAll(
      queryOptions as FindManyOptions<BankAccountEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: parseInt(query.page),
        take: parseInt(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async doesBankAccountExist(
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

  async save(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountEntity> {
    if (await this.doesBankAccountExist(createBankAccountDto)) {
      throw new BankAccountAlreadyExistsException();
    }
    return this.bankAccountRepository.save(createBankAccountDto);
  }

  async saveMany(
    createBankAccountDto: CreateBankAccountDto[],
  ): Promise<BankAccountEntity[]> {
    for (const dto of createBankAccountDto) {
      if (await this.doesBankAccountExist(dto)) {
        throw new BankAccountAlreadyExistsException();
      }
    }
    return this.bankAccountRepository.saveMany(createBankAccountDto);
  }

  async update(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccountEntity> {
    if (!(await this.doesBankAccountExist(updateBankAccountDto))) {
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
