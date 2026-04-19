import { Injectable } from '@nestjs/common';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { PurchaseInvoiceUploadRepository } from '../repositories/purchase-invoice-upload.repository';
import { PurchaseInvoiceStorageEntity } from '../entities/purchase-invoice-file.entity';
import { PurchaseInvoiceUploadNotFoundException } from '../errors/purchase-invoice-upload.notfound.error';
import { StorageService } from 'src/shared/storage/services/storage.service';

@Injectable()
export class PurchaseInvoiceStorageService {
  constructor(
    private readonly purchaseInvoiceUploadRepository: PurchaseInvoiceUploadRepository,
    private readonly storageService: StorageService,
  ) {}

  async findOneById(id: number): Promise<PurchaseInvoiceStorageEntity> {
    const upload = await this.purchaseInvoiceUploadRepository.findOneById(id);
    if (!upload) {
      throw new PurchaseInvoiceUploadNotFoundException();
    }
    return upload;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<PurchaseInvoiceStorageEntity | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const upload = await this.purchaseInvoiceUploadRepository.findOne(
      queryOptions as FindOneOptions<PurchaseInvoiceStorageEntity>,
    );
    if (!upload) return null;
    return upload;
  }

  async findAll(query: IQueryObject): Promise<PurchaseInvoiceStorageEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.purchaseInvoiceUploadRepository.findAll(
      queryOptions as FindManyOptions<PurchaseInvoiceStorageEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<PurchaseInvoiceStorageEntity>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.purchaseInvoiceUploadRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.purchaseInvoiceUploadRepository.findAll(
      queryOptions as FindManyOptions<PurchaseInvoiceStorageEntity>,
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
    purchaseInvoiceId: number,
    uploadId: number,
  ): Promise<PurchaseInvoiceStorageEntity> {
    return this.purchaseInvoiceUploadRepository.save({ purchaseInvoiceId, uploadId });
  }

  async duplicate(
    id: number,
    purchaseInvoiceId: number,
  ): Promise<PurchaseInvoiceStorageEntity> {
    //Find the original invoice upload entity
    const originalInvoiceUpload = await this.findOneById(id);

    //Use the StorageService to duplicate the file
    const duplicatedUpload = await this.storageService.duplicate(
      originalInvoiceUpload.uploadId,
    );

    //Save the duplicated PurchaseInvoiceStorageEntity
    const duplicatedInvoiceUpload = await this.purchaseInvoiceUploadRepository.save({
      purchaseInvoiceId: purchaseInvoiceId,
      uploadId: duplicatedUpload.id,
    });

    return duplicatedInvoiceUpload;
  }

  async duplicateMany(
    ids: number[],
    purchaseInvoiceId: number,
  ): Promise<PurchaseInvoiceStorageEntity[]> {
    const duplicatedInvoiceUploads = await Promise.all(
      ids.map((id) => this.duplicate(id, purchaseInvoiceId)),
    );
    return duplicatedInvoiceUploads;
  }

  async softDelete(id: number): Promise<PurchaseInvoiceStorageEntity> {
    const upload = await this.findOneById(id);
    this.storageService.delete(upload.uploadId);
    this.purchaseInvoiceUploadRepository.softDelete(upload.id);
    return upload;
  }

  async softDeleteMany(
    invoiceUploadEntities: PurchaseInvoiceStorageEntity[],
  ): Promise<PurchaseInvoiceStorageEntity[]> {
    this.storageService.deleteMany(
      invoiceUploadEntities.map((qu) => qu.upload.id),
    );
    return this.purchaseInvoiceUploadRepository.softDeleteMany(
      invoiceUploadEntities.map((qu) => qu.id),
    );
  }

  async deleteAll() {
    return this.purchaseInvoiceUploadRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.purchaseInvoiceUploadRepository.getTotalCount();
  }
}
