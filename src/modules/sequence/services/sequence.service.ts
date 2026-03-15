import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { SequenceEntity } from '../entities/sequence.entity';
import { SequenceRepository } from '../repositories/sequence.repository';

@Injectable()
export class SequenceService extends AbstractCrudService<SequenceEntity> {
  constructor(private readonly sequenceRepository: SequenceRepository) {
    super(sequenceRepository);
  }

  async findByLabel(label: string): Promise<SequenceEntity> {
    return this.sequenceRepository.findOne({ where: { label } });
  }
}
