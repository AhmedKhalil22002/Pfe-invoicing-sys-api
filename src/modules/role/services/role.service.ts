import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { RoleEntity } from '../entities/role.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleNotFoundException } from '../errors/role.notfound.error';
import { ResponseRoleDto } from '../dtos/role.response.dto';
import { CreateRoleDto } from '../dtos/role.create.dto';
import { UpdateRoleDto } from '../dtos/role.update.dto';
import { RolePermissionEntryService } from './role-permission-entry.service';
import { Transactional } from '@nestjs-cls/transactional';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionEntryService: RolePermissionEntryService,
  ) {}

  async findOneById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new RoleNotFoundException();
    }
    return role;
  }

  async findOneByCondition(query: IQueryObject): Promise<RoleEntity | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const role = await this.roleRepository.findOne(
      queryOptions as FindOneOptions<RoleEntity>,
    );
    if (!role) return null;
    return role;
  }

  async findAll(query: IQueryObject): Promise<ResponseRoleDto[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.roleRepository.findAll(
      queryOptions as FindManyOptions<RoleEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponseRoleDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.roleRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.roleRepository.findAll(
      queryOptions as FindManyOptions<RoleEntity>,
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

  @Transactional()
  async save(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.roleRepository.save(createRoleDto);
    await this.rolePermissionEntryService.saveMany(
      createRoleDto.permissionsIds.map((permissionId) => ({
        permissionId: permissionId,
        roleId: role.id,
      })),
    );
    return role;
  }

  @Transactional()
  async duplicate(id: number): Promise<RoleEntity> {
    const existingRole = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'permissionsEntries',
    });
    return this.save({
      label: `${existingRole.label} Duplicate`,
      description: existingRole.description,
      permissionsIds: existingRole.permissionsEntries.map(
        (entry) => entry.permissionId,
      ),
    });
  }

  @Transactional()
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    return this.roleRepository.update(id, updateRoleDto);
  }

  async softDelete(id: number): Promise<RoleEntity> {
    const existingRole = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'permissionsEntries',
    });
    this.rolePermissionEntryService.softDeleteMany(
      existingRole.permissionsEntries.map((entry) => entry.id),
    );
    return this.roleRepository.softDelete(id);
  }

  async deleteAll() {
    return this.roleRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.roleRepository.getTotalCount();
  }
}
