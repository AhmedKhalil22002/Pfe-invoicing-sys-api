import { Like } from 'typeorm';

export function buildWhereClause<T>(
  filters: Partial<T> | undefined,
  strictMatching: { [P in keyof T]?: string } | undefined,
): any {
  const where: any = {};
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      console.log(Boolean(strictMatching[key as keyof T]));
      if (strictMatching && strictMatching[key as keyof T] == 'true') {
        where[key] = value;
      } else {
        where[key] = Like(`%${value}%`);
      }
    }
  }
  return where;
}
