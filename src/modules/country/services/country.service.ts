import { Injectable } from '@nestjs/common';
import { CountryRepository } from '../repositories/repository/country.repository';
import { CountryEntity } from '../repositories/entities/country.entity';
import { CreateCountryDto } from '../dtos/country.create.dto';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findOneById(id: number): Promise<CountryEntity> {
    return await this.countryRepository.findOneById(id);
  }

  async findAll(): Promise<CountryEntity[]> {
    return this.countryRepository.findAll();
  }

  async save(createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    return this.countryRepository.save(createCountryDto);
  }

  async saveMany(
    createCountryDto: CreateCountryDto[],
  ): Promise<CountryEntity[]> {
    return this.countryRepository.saveMany(createCountryDto);
  }

  async softDelete(id: number): Promise<CountryEntity> {
    return this.countryRepository.softDelete(id);
  }

  async getTotal(): Promise<number> {
    return this.countryRepository.getTotalCount({});
  }

  async deleteAll() {
    return this.countryRepository.deleteAll();
  }
}
