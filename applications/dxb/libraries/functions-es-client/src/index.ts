// istanbul ignore file: doesn't hold any logic
import { getEsClient } from "./esClient";
import { getChunks, getIndexOperation, performBulkOperations } from "./utils";
import type { BulkApiResponse, IndexOperation } from "./types";

export type { BulkApiResponse, IndexOperation };
export { getEsClient, getChunks, getIndexOperation, performBulkOperations };
