import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuotationUploadEntity } from '../entities/quotation-file.entity';

@Injectable()
export class QuotationUploadRepository extends DatabaseAbstractRepostitory<QuotationUploadEntity> {
  constructor(
    @InjectRepository(QuotationUploadEntity)
    private readonly quotationUploadRespository: Repository<QuotationUploadEntity>,
  ) {
    super(quotationUploadRespository);
  }
}
