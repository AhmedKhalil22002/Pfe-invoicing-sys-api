import { Like, FindOptionsWhere } from 'typeorm';

/**
 * Constructs a TypeORM where clause object based on the provided filters and matching criteria.
 *
 * @param filters - An object containing the filters to apply.
 * @param strictMatching - An object specifying which fields require strict matching.
 * @returns A TypeORM FindOptionsWhere object.
 */
export function buildWhereClause<T>(
  filters: Partial<T> | undefined,
  strictMatching: { [P in keyof T]?: string } | undefined,
): FindOptionsWhere<T> {
  /**
   * Recursively builds the nested where clause.
   *
   * @param filters - The filters to apply at the current level.
   * @param strictMatching - The strict matching criteria at the current level.
   * @param path - The current path within the object hierarchy.
   * @returns A nested where clause.
   */
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
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        // Recursively build nested where clauses for nested objects
        where[key] = buildNestedWhere(value, strictMatching, currentPath);
      } else if (Array.isArray(value)) {
        // Handle arrays by creating multiple OR conditions
        where[key] = value.map((item) =>
          buildNestedWhere(item, strictMatching, currentPath),
        );
      } else {
        // Apply strict or partial matching based on strictMatching criteria
        if (
          strictMatching &&
          strictMatching[currentKey as keyof T] === 'true'
        ) {
          where[key] = value;
        } else {
          where[key] = Like(`%${value}%`);
        }
      }
    }
    return where;
  };

  return filters ? buildNestedWhere(filters, strictMatching ?? {}) : {};
}
