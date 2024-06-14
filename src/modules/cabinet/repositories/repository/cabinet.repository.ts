import { Repository } from 'typeorm';
import { CabinetEntity } from '../entities/cabinet.entity';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CabinetRepository extends DatabaseAbstractRepostitory<CabinetEntity> {
  constructor(
    @InjectRepository(CabinetEntity)
    private readonly cabinetRepository: Repository<CabinetEntity>,
  ) {
    super(cabinetRepository);
  }
}
