import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuotationEntity } from '../entities/quotation.entity';

@Injectable()
export class QuotationRepository extends DatabaseAbstractRepostitory<QuotationEntity> {
  constructor(
    @InjectRepository(QuotationEntity)
    private readonly quotationRepository: Repository<QuotationEntity>,
  ) {
    super(quotationRepository);
  }
}
