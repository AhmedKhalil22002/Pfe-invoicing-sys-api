import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repositories/repository/currency.repository';
import { CurrencyEntity } from '../repositories/entities/currency.entity';
import { CreateCurrencyDto } from '../dtos/currency.create.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async findOneById(id: number): Promise<CurrencyEntity> {
    return await this.currencyRepository.findOneById(id);
  }

  async findAll(): Promise<CurrencyEntity[]> {
    return this.currencyRepository.findAll();
  }

  async save(createCountryDto: CreateCurrencyDto): Promise<CurrencyEntity> {
    return this.currencyRepository.save(createCountryDto);
  }

  async saveMany(
    createCountryDto: CreateCurrencyDto[],
  ): Promise<CurrencyEntity[]> {
    return this.currencyRepository.saveMany(createCountryDto);
  }

  async softDelete(id: number): Promise<CurrencyEntity> {
    return this.currencyRepository.softDelete(id);
  }

  async getTotal(): Promise<number> {
    return this.currencyRepository.getTotalCount({});
  }

  async deleteAll() {
    return this.currencyRepository.deleteAll();
  }
}
