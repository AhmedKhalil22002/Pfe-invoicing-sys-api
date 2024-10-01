import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultConditionEntity } from '../entities/default-condition.entity';

@Injectable()
export class DefaultConditionRepository extends DatabaseAbstractRepostitory<DefaultConditionEntity> {
  constructor(
    @InjectRepository(DefaultConditionEntity)
    private readonly defaultConditionRespository: Repository<DefaultConditionEntity>,
  ) {
    super(defaultConditionRespository);
  }
}
