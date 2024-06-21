import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ActivityService } from '../services/activity.service';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageOptionsDto } from 'src/common/database/interfaces/database.pagination.interface';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { UpdateActivityDto } from '../dtos/activity.update.dto';
import { ResponseActivityDto } from '../dtos/activity.response.dto';

@ApiTags('activity')
@Controller({
  version: '1',
  path: '/activity',
})
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseActivityDto)
  async findAllPaginated(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ResponseActivityDto>> {
    return await this.activityService.findAllPaginated(pageOptionsDto);
  }

  @Get('/all')
  async findAll(): Promise<ResponseActivityDto[]> {
    return await this.activityService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseActivityDto> {
    return await this.activityService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<ResponseActivityDto> {
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
  ): Promise<ResponseActivityDto> {
    return await this.activityService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseActivityDto> {
    return await this.activityService.softDelete(id);
  }
}
