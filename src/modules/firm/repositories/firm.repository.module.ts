import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmRepository } from './firm.repository';
import { FirmEntity } from '../entities/firm.entity';

@Module({
  controllers: [],
  providers: [FirmRepository],
  exports: [FirmRepository],
  imports: [TypeOrmModule.forFeature([FirmEntity])],
})
export class FirmRepositoryModule {}
