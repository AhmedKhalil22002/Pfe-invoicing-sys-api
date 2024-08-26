import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxEntity } from '../entities/tax.entity';

@Injectable()
export class TaxRepository extends DatabaseAbstractRepostitory<TaxEntity> {
  constructor(
    @InjectRepository(TaxEntity)
    private readonly taxRepository: Repository<TaxEntity>,
  ) {
    super(taxRepository);
  }
}
