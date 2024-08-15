import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigEntity } from '../entities/app-config.entity';

@Injectable()
export class AppConfigRepository extends DatabaseAbstractRepostitory<AppConfigEntity> {
  constructor(
    @InjectRepository(AppConfigEntity)
    private readonly appConfigRepository: Repository<AppConfigEntity>,
  ) {
    super(appConfigRepository);
  }
}
