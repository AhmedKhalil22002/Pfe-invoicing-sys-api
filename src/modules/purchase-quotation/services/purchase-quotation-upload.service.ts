import { Injectable } from '@nestjs/common';
import { PurchaseQuotationUploadRepository } from '../repositories/purchase-quotation-upload.repository';
import { PurchaseQuotationStorageEntity } from '../entities/purchase-quotation-file.entity';
import { PurchaseQuotationUploadNotFoundException } from '../errors/purchase-quotation-upload.notfound';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { StorageService } from 'src/shared/storage/services/storage.service';

@Injectable()
export class PurchaseQuotationStorageService {
  constructor(
    private readonly purchaseQuotationUploadRepository: PurchaseQuotationUploadRepository,
    private readonly uploadService: StorageService,
  ) {}

  async findOneById(id: number): Promise<PurchaseQuotationStorageEntity> {
    const upload = await this.purchaseQuotationUploadRepository.findOneById(id);
    if (!upload) {
      throw new PurchaseQuotationUploadNotFoundException();
    }
    return upload;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<PurchaseQuotationStorageEntity | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const upload = await this.purchaseQuotationUploadRepository.findOne(
      queryOptions as FindOneOptions<PurchaseQuotationStorageEntity>,
    );
    if (!upload) return null;
    return upload;
  }

  async findAll(query: IQueryObject): Promise<PurchaseQuotationStorageEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.purchaseQuotationUploadRepository.findAll(
      queryOptions as FindManyOptions<PurchaseQuotationStorageEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<PurchaseQuotationStorageEntity>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.purchaseQuotationUploadRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.purchaseQuotationUploadRepository.findAll(
      queryOptions as FindManyOptions<PurchaseQuotationStorageEntity>,
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
    purchaseQuotationId: number,
    uploadId: number,
  ): Promise<PurchaseQuotationStorageEntity> {
    return this.purchaseQuotationUploadRepository.save({ purchaseQuotationId, uploadId });
  }

  async duplicate(
    id: number,
    purchaseQuotationId: number,
  ): Promise<PurchaseQuotationStorageEntity> {
    //Find the original purchaseQuotation upload entity
    const originalPurchaseQuotationUpload = await this.findOneById(id);

    //Use the StorageService to duplicate the file
    const duplicatedUpload = await this.uploadService.duplicate(
      originalPurchaseQuotationUpload.uploadId,
    );

    //Save the duplicated PurchaseQuotationStorageEntity
    const duplicatedPurchaseQuotationUpload = await this.purchaseQuotationUploadRepository.save(
      { purchaseQuotationId: purchaseQuotationId, uploadId: duplicatedUpload.id },
    );

    return duplicatedPurchaseQuotationUpload;
  }

  async duplicateMany(
    ids: number[],
    purchaseQuotationId: number,
  ): Promise<PurchaseQuotationStorageEntity[]> {
    const duplicatedPurchaseQuotationUploads = await Promise.all(
      ids.map((id) => this.duplicate(id, purchaseQuotationId)),
    );
    return duplicatedPurchaseQuotationUploads;
  }

  async softDelete(id: number): Promise<PurchaseQuotationStorageEntity> {
    const upload = await this.findOneById(id);
    this.uploadService.delete(upload.uploadId);
    this.purchaseQuotationUploadRepository.softDelete(upload.id);
    return upload;
  }

  async softDeleteMany(
    purchaseQuotationUploadEntities: PurchaseQuotationStorageEntity[],
  ): Promise<PurchaseQuotationStorageEntity[]> {
    this.uploadService.deleteMany(
      purchaseQuotationUploadEntities.map((qu) => qu.upload.id),
    );
    return this.purchaseQuotationUploadRepository.softDeleteMany(
      purchaseQuotationUploadEntities.map((qu) => qu.id),
    );
  }

  async deleteAll() {
    return this.purchaseQuotationUploadRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.purchaseQuotationUploadRepository.getTotalCount();
  }
}
