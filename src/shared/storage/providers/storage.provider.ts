import { ConfigService } from '@nestjs/config';
import { StorageService } from '../services/storage.service';
import { StorageRepository } from '../repositories/storage.repository';
import { S3StorageService } from '../services/s3-storage.service';
import { LocalStorageService } from '../services/local-storage.service';

export const storageProvider = {
  provide: StorageService,
  inject: [ConfigService, StorageRepository],
  useFactory: (
    configService: ConfigService,
    storageRepository: StorageRepository,
  ) => {
    const driver = configService.get<string>('app.storageDriver');
    if (driver === 's3')
      return new S3StorageService(storageRepository, configService);
    return new LocalStorageService(storageRepository, configService);
  },
};
