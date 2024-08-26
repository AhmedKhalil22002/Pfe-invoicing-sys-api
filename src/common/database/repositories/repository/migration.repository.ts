import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MigrationEntity } from '../entities/migration.entity';

@Injectable()
export class MigrationRepository extends DatabaseAbstractRepostitory<MigrationEntity> {
  constructor(
    @InjectRepository(MigrationEntity)
    private readonly migrationRepository: Repository<MigrationEntity>,
  ) {
    super(migrationRepository);
  }
}
