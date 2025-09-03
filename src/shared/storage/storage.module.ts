import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from './entities/upload.entity';
import { UploadRepository } from './repositories/upload.repository';

@Module({
  controllers: [],
  providers: [StorageService, UploadRepository],
  exports: [StorageService, UploadRepository],
  imports: [TypeOrmModule.forFeature([UploadEntity])],
})
export class StorageModule {}
