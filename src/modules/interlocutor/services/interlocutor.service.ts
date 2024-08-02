import { Injectable } from '@nestjs/common';
import { InterlocutorRepository } from '../repositories/repository/interlocutor.repository';
import { InterlocutorNotFoundException } from '../errors/interlocutor.notfound.error';
import { InterlocutorEntity } from '../repositories/entity/interlocutor.entity';
import { CreateInterlocutorDto } from '../dtos/interlocutor.create.dto';
import { UpdateInterlocutorDto } from '../dtos/interlocutor.update.dto';
import { ResponseInterlocutorDto } from '../dtos/interlocutor.response.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/common/database/services/databse-query-options.service';

@Injectable()
export class InterlocutorService {
  constructor(
    private readonly interlocutorRepository: InterlocutorRepository,
  ) {}

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponseInterlocutorDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const interlocutor = await this.interlocutorRepository.findOne(
      queryOptions as FindOneOptions<InterlocutorEntity>,
    );
    if (!interlocutor) return null;
    return interlocutor;
  }

  async findAll(query: IQueryObject): Promise<ResponseInterlocutorDto[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.interlocutorRepository.findAll(
      queryOptions as FindManyOptions<InterlocutorEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponseInterlocutorDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.interlocutorRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.interlocutorRepository.findAll(
      queryOptions as FindManyOptions<InterlocutorEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: parseInt(query.page),
        take: parseInt(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findOneById(id: number): Promise<InterlocutorEntity> {
    const interlocutor = await this.interlocutorRepository.findOneById(id);
    if (!interlocutor) {
      throw new InterlocutorNotFoundException();
    }
    return interlocutor;
  }

  async save(
    createInterlocutorDto: CreateInterlocutorDto,
  ): Promise<InterlocutorEntity> {
    const interlocutor = await this.interlocutorRepository.save(
      createInterlocutorDto,
    );
    return interlocutor;
  }

  async update(
    id: number,
    updateInterlocutorDto: UpdateInterlocutorDto,
  ): Promise<InterlocutorEntity> {
    const existingInterlocutor = await this.findOneById(id);
    return this.interlocutorRepository.save({
      ...existingInterlocutor,
      ...updateInterlocutorDto,
    });
  }

  async softDelete(id: number): Promise<InterlocutorEntity> {
    await this.findOneById(id);
    return this.interlocutorRepository.softDelete(id);
  }
}
