import {
  Controller,
  Param,
  Get,
  NotFoundException,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CabinetService } from '../services/cabinet.service';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { CabinetEntity } from '../repositories/entities/cabinet.entity';
import { CreateCabinetDto } from '../dtos/cabinet.create.dto';
import { UpdateActivityDto } from 'src/modules/activity/dtos/activity.update.dto';

@ApiTags('cabinet')
@Controller({
  version: '1',
  path: '/cabinet',
})
export class CabinetController {
  constructor(private readonly cabinetService: CabinetService) {}

  @Get('/list')
  async findAll(): Promise<Record<string, any>[]> {
    return await this.cabinetService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<CabinetEntity> {
    const cabinet = await this.cabinetService.findOneById(id);
    if (!cabinet) {
      throw new NotFoundException(`Cabinet with ID ${id} not found`);
    }
    return cabinet;
  }

  @Post('')
  async save(
    @Body() createCabinetDto: CreateCabinetDto,
  ): Promise<CabinetEntity> {
    return this.cabinetService.save(createCabinetDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateCabinetDto: UpdateActivityDto,
  ): Promise<CabinetEntity> {
    const cabinet = await this.findOneById(id);
    if (!cabinet) {
      throw new NotFoundException(`Cabinet with ID ${id} not found`);
    }
    return this.cabinetService.update(id, updateCabinetDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<CabinetEntity> {
    const cabinet = await this.findOneById(id);
    if (!cabinet) {
      throw new NotFoundException(`Cabinet with ID ${id} not found`);
    }
    return this.cabinetService.softDelete(id);
  }
}
