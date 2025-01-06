import { Injectable } from '@nestjs/common';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { FindManyOptions } from 'typeorm';
import { QueryBuilder } from 'src/common/database/utils/database-query-builder';
import { LoggerRepository } from '../repositories/repository/logger.repository';
import { LoggerEntity } from '../repositories/entities/logger.entity';
import { LogNotFoundException } from '../errors/log.notfound.error';
import { CreateLogDto } from '../dtos/log.create.dto';

@Injectable()
export class LoggerService {
  constructor(private readonly loggerRepository: LoggerRepository) {}

  async findOneById(id: number): Promise<LoggerEntity> {
    const log = await this.loggerRepository.findOneById(id);
    if (!log) {
      throw new LogNotFoundException();
    }
    return log;
  }

  async findAll(query: IQueryObject): Promise<LoggerEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.loggerRepository.findAll(
      queryOptions as FindManyOptions<LoggerEntity>,
    );
  }

  async save(createLogDto: CreateLogDto): Promise<LoggerEntity> {
    return this.loggerRepository.save(createLogDto);
  }

  async softDelete(id: number): Promise<LoggerEntity> {
    await this.findOneById(id);
    return this.loggerRepository.softDelete(id);
  }

  async deleteAll() {
    return this.loggerRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.loggerRepository.getTotalCount();
  }
}
