import { Injectable } from '@nestjs/common';
import { FirmRepository } from '../repositories/repository/firm.repository';
import { FirmEntity } from '../repositories/entities/firm.entity';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateFirmDto } from '../dtos/firm.create.dto';
import { FirmNotFoundException } from '../errors/firm.notfound.error';
import { UpdateFirmDto } from '../dtos/firm.update.dto';
import { QueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { PagingQueryOptions } from 'src/common/database/interfaces/database.query-options.interface';
import { ResponseFirmDto } from '../dtos/firm.response.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';

@Injectable()
export class FirmService {
  constructor(private readonly firmRepository: FirmRepository) {}

  async findOneById(id: number): Promise<FirmEntity> {
    const firm = await this.firmRepository.findOneById(id);
    if (!firm) {
      throw new FirmNotFoundException();
    }
    return firm;
  }

  async findOneByCondition(
    options: QueryOptionsDto<CreateFirmDto>,
  ): Promise<FirmEntity | null> {
    const firm = await this.firmRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!firm) return null;
    return firm;
  }

  async findAll(): Promise<FirmEntity[]> {
    return await this.firmRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseFirmDto>,
  ): Promise<PageDto<FirmEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;

    const where = buildWhereClause(filters, strictMatching);

    const count = await this.firmRepository.getTotalCount({ where });
    const entities = await this.firmRepository.findAll({
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(createFirmDto: CreateFirmDto): Promise<FirmEntity> {
    return this.firmRepository.save(createFirmDto);
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<FirmEntity> {
    const firm = await this.findOneById(id);
    return this.firmRepository.save({
      ...firm,
      ...updateFirmDto,
    });
  }

  async softDelete(id: number): Promise<FirmEntity> {
    await this.findOneById(id);
    return this.firmRepository.softDelete(id);
  }

  async deleteAll() {
    return this.firmRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.firmRepository.getTotalCount({});
  }
}
