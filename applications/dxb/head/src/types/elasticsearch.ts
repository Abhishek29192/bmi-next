export type ESResponse<T> = {
  hits: {
    hits: {
      max_score: number;
      _index: string;
      _type: "_doc";
      _id: string;
      _score: number;
      _source: T;
    };
    total: {
      value: number;
      relation: string;
    };
  };
  _source: T;
};
