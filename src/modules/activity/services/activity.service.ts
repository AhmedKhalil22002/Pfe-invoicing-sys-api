import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repositories/repository/activity.repository';
import { ActivityEntity } from '../repositories/entities/activity.entity';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import {
  PageOptionsDto,
  skip,
} from 'src/common/database/interfaces/database.pagination.interface';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { UpdateActivityDto } from '../dtos/activity.update.dto';
import { ActivityNotFoundException } from '../errors/activity.notfound.error';
import { ActivityAlreadyExistsException } from '../errors/activity.alreadyexists.error';

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

  async findOneByLabel(label: string): Promise<ActivityEntity | null> {
    const activity = await this.activityRepository.findOne({
      where: { label: label, deletedAt: null },
    });
    if (!activity) return null;
    return activity;
  }

  async findAll(): Promise<ActivityEntity[]> {
    return await this.activityRepository.findAll();
  }

  async findAllPaginated(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ActivityEntity>> {
    const count = await this.activityRepository.getTotalCount({
      withDeleted: false,
    });
    const entities = await this.activityRepository.findAll({
      skip: skip(pageOptionsDto),
      take: pageOptionsDto.take,
      order: { label: pageOptionsDto.order },
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
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
    await this.findOneByLabel(updateActivityDto.label);
    const activity = await this.findOneById(id);
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
