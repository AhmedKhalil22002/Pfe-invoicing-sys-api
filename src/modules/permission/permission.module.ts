import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { PermissionRepository } from './repositories/permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';

@Module({
  controllers: [],
  providers: [PermissionService , PermissionRepository
  ],
  exports: [PermissionService , PermissionRepository],
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
})
export class PermissionModule {}
