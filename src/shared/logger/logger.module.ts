import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerEntity } from './entities/logger.entity';
import { LoggerRepository } from './repositories/logger.repository';

@Module({
  controllers: [],
  providers: [LoggerService, LoggerRepository],
  exports: [LoggerService, LoggerRepository],
  imports: [TypeOrmModule.forFeature([LoggerEntity])],
})
export class LoggerModule {}
