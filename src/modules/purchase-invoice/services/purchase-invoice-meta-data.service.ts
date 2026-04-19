import { Injectable } from '@nestjs/common';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PurchaseInvoiceMetaDataRepository } from '../repositories/purchase-invoice-meta-data.repository';
import { PurchaseInvoiceMetaDataEntity } from '../entities/purchase-invoice-meta-data.entity';
import { PurchaseInvoiceMetaDataNotFoundException } from '../errors/purchase-invoice-meta-data.notfound.error';
import { ResponsePurchaseInvoiceMetaDataDto } from '../dtos/purchase-invoice-meta-data.response.dto';
import { CreatePurchaseInvoiceMetaDataDto } from '../dtos/purchase-invoice-meta-data.create.dto';
import { UpdatePurchaseInvoiceMetaDataDto } from '../dtos/purchase-invoice-meta-data.update.dto';

@Injectable()
export class PurchaseInvoiceMetaDataService {
  constructor(
    private readonly purchaseInvoiceMetaDataRepository: PurchaseInvoiceMetaDataRepository,
  ) {}

  async findOneById(id: number): Promise<PurchaseInvoiceMetaDataEntity> {
    const data = await this.purchaseInvoiceMetaDataRepository.findOneById(id);
    if (!data) {
      throw new PurchaseInvoiceMetaDataNotFoundException();
    }
    return data;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponsePurchaseInvoiceMetaDataDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const data = await this.purchaseInvoiceMetaDataRepository.findOne(
      queryOptions as FindOneOptions<PurchaseInvoiceMetaDataEntity>,
    );
    if (!data) return null;
    return data;
  }

  async findAll(query: IQueryObject): Promise<ResponsePurchaseInvoiceMetaDataDto[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.purchaseInvoiceMetaDataRepository.findAll(
      queryOptions as FindManyOptions<PurchaseInvoiceMetaDataEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponsePurchaseInvoiceMetaDataDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.purchaseInvoiceMetaDataRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.purchaseInvoiceMetaDataRepository.findAll(
      queryOptions as FindManyOptions<PurchaseInvoiceMetaDataEntity>,
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
    createPurchaseInvoiceMetaDataDto: CreatePurchaseInvoiceMetaDataDto,
  ): Promise<PurchaseInvoiceMetaDataEntity> {
    return this.purchaseInvoiceMetaDataRepository.save(createPurchaseInvoiceMetaDataDto);
  }

  async update(
    id: number,
    updatePurchaseInvoiceMetaDataDto: UpdatePurchaseInvoiceMetaDataDto,
  ): Promise<PurchaseInvoiceMetaDataEntity> {
    const data = await this.findOneById(id);
    return this.purchaseInvoiceMetaDataRepository.save({
      ...data,
      ...updatePurchaseInvoiceMetaDataDto,
    });
  }

  async duplicate(id: number): Promise<PurchaseInvoiceMetaDataEntity> {
    const existingData = await this.findOneById(id);
    const duplicatedData = { ...existingData, id: undefined };
    return this.purchaseInvoiceMetaDataRepository.save(duplicatedData);
  }

  async softDelete(id: number): Promise<PurchaseInvoiceMetaDataEntity> {
    await this.findOneById(id);
    return this.purchaseInvoiceMetaDataRepository.softDelete(id);
  }

  async deleteAll() {
    return this.purchaseInvoiceMetaDataRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.purchaseInvoiceMetaDataRepository.getTotalCount();
  }
}
