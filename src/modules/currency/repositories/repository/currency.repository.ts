import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyEntity } from '../entities/currency.entity';

@Injectable()
export class CurrencyRepository extends DatabaseAbstractRepostitory<CurrencyEntity> {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {
    super(currencyRepository);
  }
}
