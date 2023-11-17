import { Request } from 'express';

export interface Query {
  page: number;
  pageSize: number;
  [name: string]: string | number;
}

export function paginationBuilder(items: object, total: number, page: number, limit: number) {
  return {
    data: items,
    meta: {
      limit,
      page,
      total: total || 0,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}

export function queryParamsWithPageDetails(_req: Request) {

  const query = <Query>_req.query;
  let page = 1;
  let pageSize = 20;

  if (query.page) {
    page = isNaN(parseInt(String(query.page))) ? 1 : parseInt(String(query.page));
  }
  if (query.pageSize) {
    pageSize = isNaN(parseInt(String(query.pageSize))) ? 1 : parseInt(String(query.pageSize));

    if (pageSize > 100) {
      pageSize = 100;
    }
  }

  return {
    ...query,
    pageSize,
    page,
  };
}
