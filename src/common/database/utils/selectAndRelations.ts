import { PagingQueryOptions } from '../interfaces/database.query-options.interface';

export function getSelectAndRelations(
  relationshipColumns: string[],
  options: PagingQueryOptions<any>,
) {
  let select = {};
  let relations = {};

  if (options.relationSelect) {
    select = options.columns || {};
    relations = getAllRelations(relationshipColumns);
  } else {
    select = options.columns || {};
    relations = getSpecifiedRelations(relationshipColumns, options.columns);
  }

  return { select, relations };
}

function getAllRelations(relationshipColumns: string[]) {
  const relations = {};

  relationshipColumns.forEach((column) => {
    relations[column] = true;
  });

  return relations;
}

function getSpecifiedRelations(relationshipColumns: string[], columns?: any) {
  const relations = {};

  if (columns) {
    relationshipColumns.forEach((column) => {
      if (columns[column]) {
        relations[column] = true;
      }
    });
  }

  return relations;
}
