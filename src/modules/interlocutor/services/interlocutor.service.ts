import { Injectable } from '@nestjs/common';
import { InterlocutorRepository } from '../repositories/repository/interlocutor.repository';
import { InterlocutorNotFoundException } from '../errors/interlocutor.notfound.error';
import { InterlocutorEntity } from '../repositories/entity/interlocutor.entity';
import { CreateInterlocutorDto } from '../dtos/interlocutor.create.dto';
import { UpdateInterlocutorDto } from '../dtos/interlocutor.update.dto';
import { PagingQueryOptions } from 'src/common/database/interfaces/database.query-options.interface';
import { ResponseInterlocutorDto } from '../dtos/interlocutor.response.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { getSelectAndRelations } from 'src/common/database/utils/selectAndRelations';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';

@Injectable()
export class InterlocutorService {
  constructor(
    private readonly interlocutorRepository: InterlocutorRepository,
  ) {}

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseInterlocutorDto>,
  ): Promise<PageDto<ResponseInterlocutorDto>> {
    const { filters, strictMatching, sort, pageOptions } = options || {};

    const where = buildWhereClause<ResponseInterlocutorDto>(
      filters,
      strictMatching,
    );
    const count = await this.interlocutorRepository.getTotalCount({ where });

    const { select, relations } = getSelectAndRelations(
      await this.interlocutorRepository.getRelatedEntityNames(),
      options,
    );

    const entities = await this.interlocutorRepository.findAll({
      select,
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
      relations,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
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
    return this.interlocutorRepository.save(createInterlocutorDto);
  }

  async update(
    id: number,
    updateInterlocutorDto: UpdateInterlocutorDto,
  ): Promise<InterlocutorEntity> {
    const address = await this.findOneById(id);
    return this.interlocutorRepository.save({
      ...address,
      ...updateInterlocutorDto,
    });
  }

  async softDelete(id: number): Promise<InterlocutorEntity> {
    await this.findOneById(id);
    return this.interlocutorRepository.softDelete(id);
  }
}
