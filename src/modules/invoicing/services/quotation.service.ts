import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { QuotationEntity } from '../entities/quotation.entity';
import { QuotationRepository } from '../repositories/quotation.repository';

@Injectable()
export class QuotationService extends AbstractCrudService<QuotationEntity> {
  constructor(quotationRepository: QuotationRepository) {
    super(quotationRepository);
  }
}
