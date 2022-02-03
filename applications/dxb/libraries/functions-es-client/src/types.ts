import { ResponseError } from "@elastic/elasticsearch/lib/errors";

type BulkApiResponseAction = {
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
  status: number;
  _seq_no: number;
  _primary_term: number;
  error?: ResponseError;
};

type BulkApiResponseItem = {
  index?: BulkApiResponseAction;
  delete?: BulkApiResponseAction;
};

export type BulkApiResponse = {
  body: {
    errors: boolean;
    items: BulkApiResponseItem[];
  };
};
