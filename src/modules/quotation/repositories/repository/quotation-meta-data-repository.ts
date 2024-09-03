import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuotationMetaDataEntity } from '../entities/quotation-meta-data.entity';

@Injectable()
export class QuotationMetaDataRepository extends DatabaseAbstractRepostitory<QuotationMetaDataEntity> {
  constructor(
    @InjectRepository(QuotationMetaDataEntity)
    private readonly quotationMetaDataRespository: Repository<QuotationMetaDataEntity>,
  ) {
    super(quotationMetaDataRespository);
  }
}
