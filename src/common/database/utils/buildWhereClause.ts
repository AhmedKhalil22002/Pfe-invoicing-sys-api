import { Like, FindOptionsWhere } from 'typeorm';

export function buildWhereClause<T>(
  filters: Partial<T> | undefined,
  strictMatching: { [P in keyof T]?: string } | undefined,
): FindOptionsWhere<T> {
  const buildNestedWhere = (
    filters: any,
    strictMatching: any,
    path: string[] = [],
  ): any => {
    const where: any = {};
    for (const [key, value] of Object.entries(filters)) {
      const currentPath = [...path, key];
      const currentKey = currentPath.join('.');

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        where[key] = buildNestedWhere(value, strictMatching, currentPath);
      } else {
        if (strictMatching && strictMatching[currentKey as keyof T] == 'true') {
          where[key] = value;
        } else {
          where[key] = Like(`%${value}%`);
        }
      }
    }
    return where;
  };

  return filters ? buildNestedWhere(filters, strictMatching) : {};
}
