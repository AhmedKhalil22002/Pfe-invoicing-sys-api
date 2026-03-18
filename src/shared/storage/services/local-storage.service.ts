import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageRepository } from '../repositories/storage.repository';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import * as fs from 'fs/promises';
import { join } from 'path';
import { StorageBadRequestError } from '../errors/storage-badrequest.error';
import { StorageEntity } from '../entities/storage.entity';
import { createReadStream, ReadStream } from 'fs';
import constants from 'constants';

@Injectable()
export class LocalStorageService extends StorageService {
  rootLocation: string;
  constructor(
    storageRepository: StorageRepository,
    readonly configService: ConfigService,
  ) {
    super(storageRepository);
    this.rootLocation = this.configService.get<string>('app.uploadPath') || '/';
  }

  getStorageType(): string {
    return 'local';
  }

  async store(
    file: Express.Multer.File,
    isTemporary: boolean,
  ): Promise<StorageEntity> {
    const slug = uuidv4();
    const filename = file.originalname;
    const mimeType = file.mimetype;
    const size = file.size;

    const extension = mime.extension(mimeType) || '';

    let relativePath = slug;
    if (extension) {
      relativePath = `${slug}.${extension}`;
    }

    const entity = this.storageRepository.save({
      slug,
      filename,
      relativePath,
      mimeType,
      size,
      isTemporary,
    });

    const destinationFile = join(this.rootLocation, relativePath);

    try {
      if (!file.buffer || file.buffer.length === 0) {
        throw new StorageBadRequestError('File buffer is empty');
      }
      await fs.mkdir(this.rootLocation, { recursive: true });
      await fs.writeFile(destinationFile, file.buffer);
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to store file : ${error.message}`,
      );
    }

    return entity;
  }

  async storeMultiple(
    files: Express.Multer.File[],
    isTemporary: boolean,
  ): Promise<StorageEntity[]> {
    return Promise.all(files.map((file) => this.store(file, isTemporary)));
  }

  async loadResource(slug: string): Promise<ReadStream> {
    const entity = await this.findBySlug(slug);
    const filePath = join(this.rootLocation, entity.relativePath);

    try {
      await fs.access(filePath, constants.F_OK);
      return createReadStream(filePath);
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to load file : ${error.message}`,
      );
    }
  }

  async duplicate(id: number): Promise<StorageEntity> {
    const original = await this.storageRepository.findOneById(id);

    const slug = uuidv4();
    const originalFilePath = join(this.rootLocation, original.relativePath);

    const fileExension = mime.extension(original.mimeType) || '';
    let newRelativePath = slug;

    if (fileExension) {
      newRelativePath = `${slug}.${fileExension}`;
    }

    const newFilePath = join(this.rootLocation, newRelativePath);

    try {
      await fs.copyFile(originalFilePath, newFilePath);
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to duplicate file : ${error.message}`,
      );
    }

    return this.storageRepository.save({
      slug,
      filename: original.filename,
      relativePath: newRelativePath,
      mimeType: original.mimeType,
      size: original.size,
      isTemporary: original.isTemporary,
    });
  }

  async duplicateMany(ids: number[]): Promise<StorageEntity[]> {
    return Promise.all(ids.map((id) => this.duplicate(id)));
  }

  async delete(id: number): Promise<StorageEntity> {
    const entity = await this.storageRepository.findOneById(id);
    const filePath = join(this.rootLocation, entity.relativePath);

    try {
      await fs.unlink(filePath);
      return this.storageRepository.softDelete(id);
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to delete file : ${error.message}`,
      );
    }
  }

  async deleteBySlug(slug: string): Promise<StorageEntity> {
    const entity = await this.findBySlug(slug);
    return this.delete(entity.id);
  }

  async deleteMany(ids: number[]): Promise<StorageEntity[]> {
    return Promise.all(ids.map((id) => this.delete(id)));
  }
}
