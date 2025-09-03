import { Injectable } from '@nestjs/common';
import { ActivityEntity } from '../entities/activity.entity';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import { PageDto } from 'src/shared/database-v2/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database-v2/dtos/database.page-meta.dto';
import { UpdateActivityDto } from '../dtos/activity.update.dto';
import { ActivityNotFoundException } from '../errors/activity.notfound.error';
import { ActivityAlreadyExistsException } from '../errors/activity.alreadyexists.error';
import { IQueryObject } from 'src/shared/database-v2/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryBuilder } from 'src/shared/database-v2/utils/database-query-builder';
import { ActivityRepository } from '../repositories/activity.repository';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async findOneById(id: number): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findOneById(id);
    if (!activity) {
      throw new ActivityNotFoundException();
    }
    return activity;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ActivityEntity | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const activity = await this.activityRepository.findOne(
      queryOptions as FindOneOptions<ActivityEntity>,
    );
    if (!activity) return null;
    return activity;
  }

  async findAll(query: IQueryObject): Promise<ActivityEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.activityRepository.findAll(
      queryOptions as FindManyOptions<ActivityEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ActivityEntity>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.activityRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.activityRepository.findAll(
      queryOptions as FindManyOptions<ActivityEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: parseInt(query.page),
        take: parseInt(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneByLabel(label: string): Promise<ActivityEntity | null> {
    const activity = await this.activityRepository.findOne({
      where: { label },
    });
    if (!activity) {
      return null;
    }
    return activity;
  }

  async save(createActivityDto: CreateActivityDto): Promise<ActivityEntity> {
    const activity = await this.findOneByLabel(createActivityDto.label);
    if (activity) {
      throw new ActivityAlreadyExistsException();
    }
    return this.activityRepository.save(createActivityDto);
  }

  async saveMany(
    createActivityDtos: CreateActivityDto[],
  ): Promise<ActivityEntity[]> {
    for (const activity of createActivityDtos) {
      const existingActivity = await this.findOneByLabel(activity.label);
      if (existingActivity) {
        throw new ActivityAlreadyExistsException();
      }
    }
    return this.activityRepository.saveMany(createActivityDtos);
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityEntity> {
    const activity = await this.findOneByLabel(updateActivityDto.label);
    if (activity) {
      throw new ActivityAlreadyExistsException();
    }
    return this.activityRepository.update(id, { ...updateActivityDto });
  }

  async softDelete(id: number): Promise<ActivityEntity> {
    return this.activityRepository.softDelete(id);
  }

  async deleteAll() {
    return this.activityRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.activityRepository.getTotalCount();
  }
}
