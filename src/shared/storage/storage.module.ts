import { Module } from '@nestjs/common';
import { storageProvider } from './providers/storage.provider';
import { StorageRepository } from './repositories/storage.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from './entities/storage.entity';

@Module({
  controllers: [],
  providers: [storageProvider, StorageRepository],
  exports: [storageProvider],
  imports: [TypeOrmModule.forFeature([StorageEntity])],
})
export class StorageModule {}
