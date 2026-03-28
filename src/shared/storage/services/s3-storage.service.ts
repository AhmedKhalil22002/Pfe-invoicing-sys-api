import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageRepository } from '../repositories/storage.repository';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { StorageBadRequestError } from '../errors/storage-badrequest.error';
import { StorageEntity } from '../entities/storage.entity';
import { ReadStream } from 'fs';
import { Client as MinioClient } from 'minio';

@Injectable()
export class S3StorageService extends StorageService {
  private minio: MinioClient;
  private bucket: string;
  constructor(
    storageRepository: StorageRepository,
    readonly configService: ConfigService,
  ) {
    super(storageRepository);
    this.bucket = this.configService.get<string>('s3.bucket');
    this.minio = new MinioClient({
      endPoint: this.configService.get<string>('s3.endpoint'),
      port: this.configService.get<number>('s3.port'),
      useSSL: this.configService.get<boolean>('s3.useSSL'),
      accessKey: this.configService.get<string>('s3.accessKey'),
      secretKey: this.configService.get<string>('s3.secretKey'),
    });
    this.ensureBucketExists();
  }

  getStorageType(): string {
    return 's3';
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minio.bucketExists(this.bucket);
      if (!exists) {
        await this.minio.makeBucket(this.bucket);
      }
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to ensure bucket exists : ${error.message}`,
      );
    }
  }

  async store(
    file: Express.Multer.File,
    isTemporary: boolean = false,
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

    try {
      if (!file.buffer || file.buffer.length === 0) {
        throw new StorageBadRequestError('File buffer is empty');
      }
      await this.minio.putObject(this.bucket, relativePath, file.buffer, size, {
        'Content-Type': mimeType,
      });
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to store file : ${error.message}`,
      );
    }

    return entity;
  }

  async storeMultiple(
    files: Express.Multer.File[],
    isTemporary: boolean = false,
  ): Promise<StorageEntity[]> {
    return Promise.all(files.map((file) => this.store(file, isTemporary)));
  }

  async loadResource(slug: string): Promise<ReadStream> {
    const entity = await this.findBySlug(slug);

    try {
      const stream = await this.minio.getObject(
        this.bucket,
        entity.relativePath,
      );
      return stream as ReadStream;
    } catch (error) {
      throw new StorageBadRequestError(
        `Failed to load file : ${error.message}`,
      );
    }
  }

  async duplicate(id: number): Promise<StorageEntity> {
    const original = await this.storageRepository.findOneById(id);

    const slug = uuidv4();
    const fileExension = mime.extension(original.mimeType) || '';
    let newRelativePath = slug;

    const size = original.size;

    if (fileExension) {
      newRelativePath = `${slug}.${fileExension}`;
    }

    try {
      const originalStream = await this.minio.getObject(
        this.bucket,
        original.relativePath,
      );
      const chunks: Buffer[] = [];
      for await (const chunk of originalStream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      await this.minio.putObject(this.bucket, newRelativePath, buffer, size, {
        'Content-Type': original.mimeType,
      });
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

    try {
      await this.minio.removeObject(this.bucket, entity.relativePath);
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
