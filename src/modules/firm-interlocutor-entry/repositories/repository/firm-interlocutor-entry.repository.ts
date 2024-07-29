import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirmInterlocutorEntryEntity } from '../entities/firm-interlocutor-entry.entity';

@Injectable()
export class FirmInterlocutorEntryRepository extends DatabaseAbstractRepostitory<FirmInterlocutorEntryEntity> {
  constructor(
    @InjectRepository(FirmInterlocutorEntryEntity)
    private readonly firmInterlocutorEntryRepository: Repository<FirmInterlocutorEntryEntity>,
  ) {
    super(firmInterlocutorEntryRepository);
  }
}
