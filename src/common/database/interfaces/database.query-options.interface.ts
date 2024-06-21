import { PageOptionsDto } from './database.pagination.interface';

export interface QueryOptions<T> {
  filters?: Partial<T>;
  strictMatching?: { [P in keyof T]?: string };
  sort?: { [P in keyof T]?: 'ASC' | 'DESC' };
  pageOptions?: PageOptionsDto;
}
