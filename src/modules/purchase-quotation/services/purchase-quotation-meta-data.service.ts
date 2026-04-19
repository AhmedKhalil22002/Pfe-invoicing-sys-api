import { Injectable } from '@nestjs/common';
import { PurchaseQuotationMetaDataEntity } from '../entities/purchase-quotation-meta-data.entity';
import { PurchaseQuotationMetaDataRepository } from '../repositories/purchase-quotation-meta-data-repository';
import { PurchaseQuotationMetaDataNotFoundException } from '../errors/quoation-meta-data.notfound.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ResponsePurchaseQuotationMetaDataDto } from '../dtos/purchase-quotation-meta-data.response.dto';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { CreatePurchaseQuotationMetaDataDto } from '../dtos/purchase-quotation-meta-data.create.dto';
import { UpdatePurchaseQuotationMetaDataDto } from '../dtos/purchase-quotation-meta-data.update.dto';

@Injectable()
export class PurchaseQuotationMetaDataService {
  constructor(
    private readonly purchaseQuotationMetaDataRepository: PurchaseQuotationMetaDataRepository,
  ) {}

  async findOneById(id: number): Promise<PurchaseQuotationMetaDataEntity> {
    const data = await this.purchaseQuotationMetaDataRepository.findOneById(id);
    if (!data) {
      throw new PurchaseQuotationMetaDataNotFoundException();
    }
    return data;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponsePurchaseQuotationMetaDataDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const data = await this.purchaseQuotationMetaDataRepository.findOne(
      queryOptions as FindOneOptions<PurchaseQuotationMetaDataEntity>,
    );
    if (!data) return null;
    return data;
  }

  async findAll(query: IQueryObject): Promise<ResponsePurchaseQuotationMetaDataDto[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.purchaseQuotationMetaDataRepository.findAll(
      queryOptions as FindManyOptions<PurchaseQuotationMetaDataEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponsePurchaseQuotationMetaDataDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.purchaseQuotationMetaDataRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.purchaseQuotationMetaDataRepository.findAll(
      queryOptions as FindManyOptions<PurchaseQuotationMetaDataEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: parseInt(query.page),
        take: parseInt(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(
    createPurchaseQuotationMetaDataDto: CreatePurchaseQuotationMetaDataDto,
  ): Promise<PurchaseQuotationMetaDataEntity> {
    return this.purchaseQuotationMetaDataRepository.save(createPurchaseQuotationMetaDataDto);
  }

  async update(
    id: number,
    updatePurchaseQuotationMetaDataDto: UpdatePurchaseQuotationMetaDataDto,
  ): Promise<PurchaseQuotationMetaDataEntity> {
    const data = await this.findOneById(id);
    return this.purchaseQuotationMetaDataRepository.save({
      ...data,
      ...updatePurchaseQuotationMetaDataDto,
    });
  }

  async duplicate(id: number): Promise<PurchaseQuotationMetaDataEntity> {
    const existingData = await this.findOneById(id);
    const duplicatedData = { ...existingData, id: undefined };
    return this.purchaseQuotationMetaDataRepository.save(duplicatedData);
  }

  async softDelete(id: number): Promise<PurchaseQuotationMetaDataEntity> {
    await this.findOneById(id);
    return this.purchaseQuotationMetaDataRepository.softDelete(id);
  }

  async deleteAll() {
    return this.purchaseQuotationMetaDataRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.purchaseQuotationMetaDataRepository.getTotalCount();
  }
}
