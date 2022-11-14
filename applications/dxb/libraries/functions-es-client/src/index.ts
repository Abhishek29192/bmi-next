// istanbul ignore file: doesn't hold any logic
import { getEsClient } from "./esClient";
import type { BulkApiResponse, DeleteOperation, IndexOperation } from "./types";
import {
  getChunks,
  getDeleteOperation,
  getIndexOperation,
  performBulkOperations
} from "./utils";

export type { BulkApiResponse, DeleteOperation, IndexOperation };
export {
  getEsClient,
  getChunks,
  getDeleteOperation,
  getIndexOperation,
  performBulkOperations
};
