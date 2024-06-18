import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  ConflictException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ActivityService } from '../services/activity.service';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { ActivityEntity } from '../repositories/entities/activity.entity';
import { PageOptionsDto } from 'src/common/database/interfaces/database.pagination.interface';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { UpdateActivityDto } from '../dtos/activity.update.dto';

@ApiTags('activity')
@Controller({
  version: '1',
  path: '/activity',
})
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('/list')
  @ApiPaginatedResponse(ActivityEntity)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ActivityEntity>> {
    return await this.activityService.findAll(pageOptionsDto);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<Record<string, any>> {
    const activity = await this.activityService.findOneById(id);
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  @Post('')
  async save(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<Record<string, any>> {
    const activity = await this.activityService.findOneByLabel(
      createActivityDto.label,
    );
    if (activity) {
      throw new ConflictException(
        `Activity with label "${createActivityDto.label}" already exists`,
      );
    }
    return await this.activityService.save(createActivityDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<Record<string, any>> {
    const activity = await this.activityService.update(id, updateActivityDto);
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<Record<string, any>> {
    const activity = await this.activityService.softDelete(id);
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }
}
