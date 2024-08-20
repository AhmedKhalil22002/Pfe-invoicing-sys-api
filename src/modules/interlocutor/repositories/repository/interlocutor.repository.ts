import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterlocutorEntity } from '../entity/interlocutor.entity';

@Injectable()
export class InterlocutorRepository extends DatabaseAbstractRepostitory<InterlocutorEntity> {
  constructor(
    @InjectRepository(InterlocutorEntity)
    private readonly interlocutorRepository: Repository<InterlocutorEntity>,
  ) {
    super(interlocutorRepository);
  }
}
