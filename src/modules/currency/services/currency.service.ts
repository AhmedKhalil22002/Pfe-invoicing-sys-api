import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repositories/repository/currency.repository';
import { CurrencyEntity } from '../repositories/entities/currency.entity';
import { CreateCurrencyDto } from '../dtos/currency.create.dto';
import { CurrencyNotFoundException } from '../errors/currency.notfound.error';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async findOneById(id: number): Promise<CurrencyEntity> {
    const currency = await this.currencyRepository.findOneById(id);
    if (!currency) {
      throw new CurrencyNotFoundException();
    }
    return currency;
  }

  async findAll(): Promise<CurrencyEntity[]> {
    return this.currencyRepository.findAll();
  }

  async save(createCurrencyDto: CreateCurrencyDto): Promise<CurrencyEntity> {
    return this.currencyRepository.save(createCurrencyDto);
  }

  async saveMany(
    createCurrencyDtos: CreateCurrencyDto[],
  ): Promise<CurrencyEntity[]> {
    return this.currencyRepository.saveMany(createCurrencyDtos);
  }

  async softDelete(id: number): Promise<CurrencyEntity> {
    await this.findOneById(id);
    return this.currencyRepository.softDelete(id);
  }

  async getTotal(): Promise<number> {
    return this.currencyRepository.getTotalCount();
  }

  async deleteAll() {
    return this.currencyRepository.deleteAll();
  }
}
