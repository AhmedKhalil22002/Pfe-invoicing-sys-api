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
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class InterlocutorService {
  constructor(
    private readonly interlocutorRepository: InterlocutorRepository,
  ) {}

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseInterlocutorDto> & {
      firmId: number;
    },
  ): Promise<PageDto<ResponseInterlocutorDto>> {
    const { filters, strictMatching, sort, pageOptions, firmId } =
      options || {};

    const where: FindOptionsWhere<InterlocutorEntity> =
      buildWhereClause<ResponseInterlocutorDto>(filters, strictMatching);

    const firmWhere = [
      { mainFirms: { id: firmId } },
      { firms: { id: firmId } },
    ];

    const count = await this.interlocutorRepository.getTotalCount({
      where: firmWhere.map((f) => ({ ...where, ...f })),
    });

    const entities = await this.interlocutorRepository.findAll({
      where: firmWhere.map((f) => ({ ...where, ...f })),
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
      relations: ['firms', 'mainFirms'],
      loadRelationIds: true,
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
