import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repositories/repository/activity.repository';
import { ActivityEntity } from '../repositories/entities/activity.entity';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import { DeepPartial } from 'typeorm';
import {
  PageOptionsDto,
  skip,
} from 'src/common/database/interfaces/database.pagination.interface';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async findOneById(id: number): Promise<ActivityEntity> {
    return await this.activityRepository.findOneById(id);
  }

  async findOneByLabel(label: string): Promise<ActivityEntity> {
    return await this.activityRepository.findOne({
      where: { label: label, deletedAt: null },
    });
  }

  async findAll(
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

  async save(
    createActivityDto: DeepPartial<CreateActivityDto>,
  ): Promise<ActivityEntity> {
    return this.activityRepository.save(createActivityDto);
  }

  async update(
    id: number,
    updateActivityDto: DeepPartial<CreateActivityDto>,
  ): Promise<ActivityEntity> {
    const activity = await this.findOneById(id);
    return this.activityRepository.save({
      ...updateActivityDto,
      ...activity,
    });
  }

  async softDelete(id: number): Promise<ActivityEntity> {
    return this.activityRepository.softDelete(id);
  }

  async getTotal(): Promise<number> {
    return this.activityRepository.getTotalCount({});
  }
}
