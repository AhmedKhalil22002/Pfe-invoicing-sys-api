import { Injectable } from '@nestjs/common';
import { FirmRepository } from '../repositories/repository/firm.repository';
import { FirmEntity } from '../repositories/entities/firm.entity';
import {
  PageOptionsDto,
  skip,
} from 'src/common/database/interfaces/database.pagination.interface';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateFirmDto } from '../dtos/firm.create.dto';
import { FirmNotFoundException } from '../errors/firm.notfound.error';
import { UpdateFirmDto } from '../dtos/firm.update.dto';

@Injectable()
export class FirmService {
  constructor(private readonly firmRepository: FirmRepository) {}

  async findOneById(id: number): Promise<FirmEntity> {
    const firm = await this.firmRepository.findOneById(id);
    if (!firm) {
      throw new FirmNotFoundException();
    }
    return firm;
  }

  async findAll(): Promise<FirmEntity[]> {
    return await this.firmRepository.findAll();
  }

  async findAllPaginated(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FirmEntity>> {
    const count = await this.firmRepository.getTotalCount({
      withDeleted: false,
    });
    const entities = await this.firmRepository.findAll({
      skip: skip(pageOptionsDto),
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(createFirmDto: CreateFirmDto): Promise<FirmEntity> {
    return this.firmRepository.save(createFirmDto);
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<FirmEntity> {
    const firm = await this.findOneById(id);
    return this.firmRepository.save({
      ...firm,
      ...updateFirmDto,
    });
  }

  async softDelete(id: number): Promise<FirmEntity> {
    await this.findOneById(id);
    return this.firmRepository.softDelete(id);
  }

  async deleteAll() {
    return this.firmRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.firmRepository.getTotalCount({});
  }
}
