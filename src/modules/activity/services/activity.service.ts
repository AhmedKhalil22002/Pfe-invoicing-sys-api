import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repositories/repository/activity.repository';
import { ActivityEntity } from '../repositories/entities/activity.entity';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { UpdateActivityDto } from '../dtos/activity.update.dto';
import { ActivityNotFoundException } from '../errors/activity.notfound.error';
import { ActivityAlreadyExistsException } from '../errors/activity.alreadyexists.error';
import { ResponseActivityDto } from '../dtos/activity.response.dto';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';

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
    options: QueryOptions<ResponseActivityDto>,
  ): Promise<ActivityEntity | null> {
    const activity = await this.activityRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!activity) return null;
    return activity;
  }

  async findOneByLabel(label: string): Promise<ActivityEntity | null> {
    const activity = await this.findOneByCondition({
      filters: { label },
    });
    if (!activity) {
      return null;
    }
    return activity;
  }

  async findAll(): Promise<ActivityEntity[]> {
    return await this.activityRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseActivityDto>,
  ): Promise<PageDto<ActivityEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;
    console.log(options);
    const where = buildWhereClause(filters, strictMatching);
    const count = await this.activityRepository.getTotalCount({ where });
    const entities = await this.activityRepository.findAll({
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });
    return new PageDto(entities, pageMetaDto);
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
    let activity = await this.findOneByLabel(updateActivityDto.label);
    if (activity) {
      throw new ActivityAlreadyExistsException();
    }
    activity = await this.findOneById(id);
    return this.activityRepository.save({
      ...activity,
      ...updateActivityDto,
    });
  }

  async softDelete(id: number): Promise<ActivityEntity> {
    await this.findOneById(id);
    return this.activityRepository.softDelete(id);
  }

  async deleteAll() {
    return this.activityRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.activityRepository.getTotalCount({});
  }
}
