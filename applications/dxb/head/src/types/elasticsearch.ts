export type ESResponse<T, A = never> = {
  hits: {
    hits: {
      max_score: number;
      _index: string;
      _type: "_doc";
      _id: string;
      _score: number;
      _source: T;
    }[];
    total: {
      value: number;
      relation: string;
    };
  };
  aggregations: A;
};
