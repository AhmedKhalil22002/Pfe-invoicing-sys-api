import { Injectable } from '@nestjs/common';
import { TaxRepository } from '../repositories/repository/tax.repository';
import { TaxEntity } from '../repositories/entities/tax.entity';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateTaxDto } from '../dtos/tax.create.dto';
import { UpdateTaxDto } from '../dtos/tax.update.dto';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { ResponseTaxDto } from '../dtos/tax.response.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { TaxNotFoundException } from '../errors/tax.notfound.error';
import { TaxAlreadyExistsException } from '../errors/tax.alreadyexists.error';

@Injectable()
export class TaxService {
  constructor(private readonly taxRepository: TaxRepository) {}

  async findOneById(id: number): Promise<TaxEntity> {
    const tax = await this.taxRepository.findOneById(id);
    if (!tax) {
      throw new TaxNotFoundException();
    }
    return tax;
  }

  async findOneByCondition(
    options: QueryOptions<ResponseTaxDto>,
  ): Promise<TaxEntity> {
    const tax = await this.taxRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!tax) return null;
    return tax;
  }

  async findAll(): Promise<TaxEntity[]> {
    return await this.taxRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseTaxDto>,
  ): Promise<PageDto<TaxEntity>> {
    // console.log(options);
    const { filters, strictMatching, sort, pageOptions } = options;

    const where = buildWhereClause(filters, strictMatching);
    // console.log(where);
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
    const tax = await this.taxRepository.findByCondition({
      where: { label: createTaxDto.label },
    });
    if (tax) {
      throw new TaxAlreadyExistsException();
    }
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
    await this.findOneById(id);
    return this.taxRepository.softDelete(id);
  }

  async deleteAll(): Promise<void> {
    return this.taxRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.taxRepository.getTotalCount({});
  }
}
