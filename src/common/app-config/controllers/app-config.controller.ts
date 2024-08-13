import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AppConfigService } from '../services/app-config.service';
import { ResponseAppConfigDto } from '../dtos/app-config.response';
import { CreateAppConfigDto } from '../dtos/app-config.create.dto';
import { UpdateAppConfigDto } from '../dtos/app-config.update.dto';

@ApiTags('app-config')
@Controller({
  version: '1',
  path: '/app-config',
})
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('/all')
  async findAll(): Promise<ResponseAppConfigDto[]> {
    return await this.appConfigService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseAppConfigDto> {
    return await this.appConfigService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createActivityDto: CreateAppConfigDto,
  ): Promise<ResponseAppConfigDto> {
    return await this.appConfigService.save(createActivityDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateAppConfigDto,
  ): Promise<ResponseAppConfigDto> {
    return await this.appConfigService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseAppConfigDto> {
    return await this.appConfigService.softDelete(id);
  }
}
