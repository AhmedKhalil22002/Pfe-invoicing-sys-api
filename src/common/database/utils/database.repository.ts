import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { DatabaseInterfaceRepository } from '../interfaces/database.repository.interface';
import { EntityHelper } from '../interfaces/database.entity.interface';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class DatabaseAbstractRepository<T extends EntityHelper>
  implements DatabaseInterfaceRepository<T>
{
  protected txHost?: TransactionHost<TransactionalAdapterTypeOrm>;

  protected constructor(
    protected readonly entity: Repository<T>,
    txHost?: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    this.txHost = txHost;
  }

  private getRepository(): Repository<T> {
    return this.txHost?.tx?.getRepository(this.entity.target) || this.entity;
  }

  public async createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): Promise<SelectQueryBuilder<T>> {
    return this.getRepository().createQueryBuilder(alias, queryRunner);
  }

  public async getRelatedEntityNames(): Promise<string[]> {
    return this.getRepository()
      .metadata.relations.filter(
        (relation) =>
          relation.isManyToOne || relation.isOneToOne || relation.isManyToMany,
      )
      .map((relation) => relation.propertyName);
  }

  public async findOneById(id: string | number): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    } as unknown as FindOptionsWhere<T>;
    return await this.getRepository().findOneBy(options);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.getRepository().save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.getRepository().save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.getRepository().create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.getRepository().create(data);
  }

  public async update(
    id: string | number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.getRepository().update(id, data);
  }

  public async updateMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.getRepository().save(data);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.getRepository().findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.getRepository().find(relations);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return this.getRepository().findOne(options);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.getRepository().find(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.getRepository().remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.getRepository().preload(entityLike);
  }

  public async getTotalCount(options: FindOneOptions<T> = {}): Promise<number> {
    return this.getRepository().count(options);
  }

  public async delete(id: string | number): Promise<void> {
    await this.getRepository().delete(id);
  }

  public async softDelete(id: string | number): Promise<T> {
    const entity = await this.findOneById(id);
    await this.getRepository().softDelete(id);
    return entity;
  }

  public async softDeleteMany(ids: (string | number)[]): Promise<T[]> {
    const options: FindManyOptions<T> = {
      id: In(ids),
    } as unknown as FindManyOptions<T>;

    const entities = await this.findAll(options);

    await Promise.all(
      ids.map(async (id) => {
        return this.getRepository().softDelete(id);
      }),
    );

    return entities;
  }

  public async deleteAll(): Promise<void> {
    await this.getRepository().clear();
  }
}
