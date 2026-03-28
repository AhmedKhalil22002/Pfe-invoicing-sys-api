import { Logger } from '@nestjs/common';
import { StorageRepository } from '../repositories/storage.repository';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { StorageEntity } from '../entities/storage.entity';
import { ReadStream } from 'fs';
import { Cron, CronExpression } from '@nestjs/schedule';

export abstract class StorageService extends AbstractCrudService<StorageEntity> {
  storageRepository: StorageRepository;
  logger = new Logger(StorageService.name);

  constructor(storageRepository: StorageRepository) {
    super(storageRepository);
    this.storageRepository = storageRepository;
  }

  abstract getStorageType(): string;

  async findBySlug(slug: string): Promise<StorageEntity> {
    return this.storageRepository.findOne({ where: { slug } });
  }

  abstract store(
    file: Express.Multer.File,
    isTemporary?: boolean,
  ): Promise<StorageEntity>;

  abstract storeMultiple(
    files: Express.Multer.File[],
    isTemporary?: boolean,
  ): Promise<StorageEntity[]>;

  async confirm(id: number): Promise<StorageEntity> {
    const entity = await this.storageRepository.findOneById(id);
    if (!entity) {
      throw new Error('Storage entity not found');
    }
    entity.isTemporary = false;
    return this.storageRepository.save(entity);
  }

  async unconfirm(id: number): Promise<StorageEntity> {
    const entity = await this.storageRepository.findOneById(id);
    if (!entity) {
      throw new Error('Storage entity not found');
    }
    entity.isTemporary = true;
    return this.storageRepository.save(entity);
  }

  async findAllTemporary(): Promise<StorageEntity[]> {
    return this.storageRepository.findAll({ where: { isTemporary: true } });
  }

  abstract loadResource(slug: string): Promise<ReadStream>;

  abstract duplicate(id: number): Promise<StorageEntity>;
  abstract duplicateMany(ids: number[]): Promise<StorageEntity[]>;

  abstract delete(id: number): Promise<StorageEntity>;
  abstract deleteBySlug(slug: string): Promise<StorageEntity>;
  abstract deleteMany(ids: number[]): Promise<StorageEntity[]>;

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanTemporary() {
    this.logger.log('Cleaning up temporary files');
    const files = await this.findAllTemporary();
    if (files.length === 0) {
      this.logger.log('No temporary files to clean');
      return;
    }
    await Promise.all(files.map((file) => this.deleteBySlug(file.slug)));
    this.logger.log(`${files.length} file(s) cleaned up`);
  }
}
