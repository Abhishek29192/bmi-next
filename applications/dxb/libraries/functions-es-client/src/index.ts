// istanbul ignore file: doesn't hold any logic
import { getEsClient } from "./esClient";
import {
  getChunks,
  getDeleteOperation,
  getIndexOperation,
  performBulkOperations
} from "./utils";
import type { BulkApiResponse, DeleteOperation, IndexOperation } from "./types";

export type { BulkApiResponse, DeleteOperation, IndexOperation };
export {
  getEsClient,
  getChunks,
  getDeleteOperation,
  getIndexOperation,
  performBulkOperations
};
