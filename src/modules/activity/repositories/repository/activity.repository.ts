import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from '../entities/activity.entity';

@Injectable()
export class ActivityRepository extends DatabaseAbstractRepostitory<ActivityEntity> {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {
    super(activityRepository);
  }
}
