import { Injectable } from '@nestjs/common';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { QuotationRepository } from '../repositories/repository/quotation.repository';
import { QuotationEntity } from '../repositories/entities/quotation.entity';
import { QuotationNotFoundException } from '../errors/quotation.notfound.error';
import { ResponseQuotationDto } from '../dtos/quotation.response.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateQuotationDto } from '../dtos/quotation.create.dto';
import { UpdateQuotationDto } from '../dtos/quotation.update.dto';

@Injectable()
export class QuotationService {
  constructor(private readonly quotationRepository: QuotationRepository) {}

  async findOneById(id: number): Promise<QuotationEntity> {
    const quotation = await this.quotationRepository.findOneById(id);
    if (!quotation) {
      throw new QuotationNotFoundException();
    }
    return quotation;
  }

  async findOneByCondition(
    options: QueryOptions<ResponseQuotationDto>,
  ): Promise<QuotationEntity | null> {
    const quotation = await this.quotationRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!quotation) return null;
    return quotation;
  }

  async findAll(): Promise<QuotationEntity[]> {
    return await this.quotationRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseQuotationDto>,
  ): Promise<PageDto<QuotationEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;
    const where = buildWhereClause(filters, strictMatching);
    const count = await this.quotationRepository.getTotalCount({ where });
    const entities = await this.quotationRepository.findAll({
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

  async save(createQuotationDto: CreateQuotationDto): Promise<QuotationEntity> {
    return this.quotationRepository.save(createQuotationDto);
  }

  async saveMany(
    createQuotationDtos: CreateQuotationDto[],
  ): Promise<QuotationEntity[]> {
    return this.quotationRepository.saveMany(createQuotationDtos);
  }

  async update(
    id: number,
    updateQuotationDto: UpdateQuotationDto,
  ): Promise<QuotationEntity> {
    const quotation = await this.findOneById(id);
    return this.quotationRepository.save({
      ...quotation,
      ...updateQuotationDto,
    });
  }

  async softDelete(id: number): Promise<QuotationEntity> {
    await this.findOneById(id);
    return this.quotationRepository.softDelete(id);
  }

  async deleteAll() {
    return this.quotationRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.quotationRepository.getTotalCount({});
  }
}
