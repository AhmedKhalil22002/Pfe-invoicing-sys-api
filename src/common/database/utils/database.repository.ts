import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DatabaseInterfaceRepository } from '../interfaces/database.repository.interface';
import { EntityHelper } from '../interfaces/database.entity.interface';

export abstract class DatabaseAbstractRepostitory<T extends EntityHelper>
  implements DatabaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): Promise<SelectQueryBuilder<T>> {
    return this.entity.createQueryBuilder(alias, queryRunner);
  }

  public async getRelatedEntityNames(): Promise<string[]> {
    return this.entity.metadata.relations
      .filter(
        (relation) =>
          relation.isManyToOne || relation.isOneToOne || relation.isManyToMany,
      )
      .map((relation) => relation.propertyName);
  }

  public async findOneById(id: string | number): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    } as unknown as FindOptionsWhere<T>;
    return await this.entity.findOneBy(options);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return this.entity.findOne(options);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }

  public async getTotalCount(options: FindOneOptions<T> = {}): Promise<number> {
    return this.entity.count(options);
  }

  public async delete(id: string | number): Promise<void> {
    await this.entity.delete(id);
  }

  public async softDelete(id: string | number): Promise<T> {
    const entity = await this.findOneById(id);
    await this.entity.softDelete(id);
    return entity;
  }

  public async deleteAll(): Promise<void> {
    await this.entity.clear();
  }
}
