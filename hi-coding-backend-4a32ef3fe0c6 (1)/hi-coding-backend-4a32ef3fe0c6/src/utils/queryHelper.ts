export interface Params {
  [name: string]: string;
}

export function queryBuilder(
  page: number,
  pageSize: number,
  type: string,
  exclude?: string[],
  match?: object,
  lookup?: object[]
) {
  let excludeObject: { [name: string]: number } = {};

  let query: any = [];

  if (lookup) {
    query = [...query, ...lookup];
  }

  if (match) {
    query = [
      ...query,
      {
        $match: match
      }
    ];
  }

  if (exclude && exclude?.length > 0) {
    for (const name of exclude) {
      excludeObject = { ...excludeObject, ...{ [name]: 0 } };
    }

    query = [
      ...query,
      {
        $project: excludeObject
      }
    ];
  }
  const pipeline = [
    ...query,
    {
      $facet: {
        total: [{ $count: 'count' }],
        [type]: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }]
      }
    },
    {
      $project: {
        total: { $arrayElemAt: ['$total.count', 0] },
        [type]: 1
      }
    }
  ];

  return pipeline;
}
