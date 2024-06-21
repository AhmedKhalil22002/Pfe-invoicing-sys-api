import { Injectable } from '@nestjs/common';
import { TaxRepository } from '../repositories/repository/tax.repository';
import { TaxEntity } from '../repositories/entities/tax.entity';
import {
  PageOptionsDto,
  skip,
} from 'src/common/database/interfaces/database.pagination.interface';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateTaxDto } from '../dtos/tax.create.dto';
import { UpdateTaxDto } from '../dtos/tax.update.dto';

@Injectable()
export class TaxService {
  constructor(private readonly taxRepository: TaxRepository) {}

  async findOneById(id: number): Promise<TaxEntity> {
    return await this.taxRepository.findOneById(id);
  }

  async findOneByLabel(label: string): Promise<TaxEntity> {
    return await this.taxRepository.findOne({
      where: { label: label, deletedAt: null },
    });
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<TaxEntity>> {
    const count = await this.taxRepository.getTotalCount({
      withDeleted: false,
    });
    const entities = await this.taxRepository.findAll({
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

  async save(createTaxDto: CreateTaxDto): Promise<TaxEntity> {
    return this.taxRepository.save(createTaxDto);
  }

  async saveMany(createTaxDtos: CreateTaxDto[]): Promise<TaxEntity[]> {
    return this.taxRepository.saveMany(createTaxDtos);
  }

  async update(id: number, updateTaxDto: UpdateTaxDto): Promise<TaxEntity> {
    const tax = await this.findOneById(id);
    return this.taxRepository.save({
      ...tax,
      ...updateTaxDto,
    });
  }

  async softDelete(id: number): Promise<TaxEntity> {
    return this.taxRepository.softDelete(id);
  }

  async deleteAll(): Promise<void> {
    return this.taxRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.taxRepository.getTotalCount({});
  }
}
