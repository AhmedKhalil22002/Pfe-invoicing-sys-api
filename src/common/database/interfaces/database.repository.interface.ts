import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface DatabaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string): Promise<T | undefined>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findOne(options: FindOneOptions<T>): Promise<T | undefined>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  softDelete(id: string | number): Promise<T>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  getTotalCount(options: FindOneOptions<T>): Promise<number>;
}
