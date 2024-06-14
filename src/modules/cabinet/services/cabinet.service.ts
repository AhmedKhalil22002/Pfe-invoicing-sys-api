import { Injectable } from '@nestjs/common';
import { CabinetRepository } from '../repositories/repository/cabinet.repository';
import { CreateCabinetDto } from '../dtos/cabinet.create.dto';
import { CabinetEntity } from '../repositories/entities/cabinet.entity';
import { DeepPartial } from 'typeorm';
import { UpdateActivityDto } from 'src/modules/activity/dtos/activity.update.dto';

@Injectable()
export class CabinetService {
  constructor(private readonly cabinetRepository: CabinetRepository) {}

  async findOneById(id: number): Promise<CabinetEntity> {
    return await this.cabinetRepository.findOneById(id);
  }

  async findAll(): Promise<CabinetEntity[]> {
    return this.cabinetRepository.findAll();
  }

  async save(
    createCabinetDto: DeepPartial<CreateCabinetDto>,
  ): Promise<CabinetEntity> {
    return this.cabinetRepository.save(createCabinetDto);
  }

  async update(
    id: number,
    updateCabinetDto: DeepPartial<UpdateActivityDto>,
  ): Promise<CabinetEntity> {
    const cabinet = await this.findOneById(id);
    return this.cabinetRepository.save({
      ...updateCabinetDto,
      ...cabinet,
    });
  }

  async softDelete(id: number): Promise<CabinetEntity> {
    return this.cabinetRepository.softDelete(id);
  }

  async getTotal(): Promise<number> {
    return this.cabinetRepository.getTotalCount({});
  }
}
