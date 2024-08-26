import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirmEntity } from '../entities/firm.entity';

@Injectable()
export class FirmRepository extends DatabaseAbstractRepostitory<FirmEntity> {
  constructor(
    @InjectRepository(FirmEntity)
    private readonly firmRepository: Repository<FirmEntity>,
  ) {
    super(firmRepository);
  }
}
