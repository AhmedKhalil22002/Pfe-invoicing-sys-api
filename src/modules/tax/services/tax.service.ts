import { Injectable } from '@nestjs/common';
import { TaxRepository } from '../repositories/repository/tax.repository';
import { TaxEntity } from '../repositories/entities/tax.entity';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateTaxDto } from '../dtos/tax.create.dto';
import { UpdateTaxDto } from '../dtos/tax.update.dto';
import { QueryOptions } from 'src/common/database/interfaces/database.query-options.interface';
import { ResponseTaxDto } from '../dtos/tax.response.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';

@Injectable()
export class TaxService {
  constructor(private readonly taxRepository: TaxRepository) {}

  async findOneById(id: number): Promise<TaxEntity> {
    return await this.taxRepository.findOneById(id);
  }

  async findOneByCondition(
    options: QueryOptions<ResponseTaxDto>,
  ): Promise<TaxEntity> {
    return await this.taxRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
  }

  async findAll(
    options?: QueryOptions<ResponseTaxDto>,
  ): Promise<PageDto<TaxEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;

    const where = buildWhereClause(filters, strictMatching);

    const count = await this.taxRepository.getTotalCount({ where });
    const entities = await this.taxRepository.findAll({
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
