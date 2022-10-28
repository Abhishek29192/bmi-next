import logger from "@bmi-digital/functions-logger";
import { Client } from "@elastic/elasticsearch";
import { BulkApiResponse, DeleteOperation, IndexOperation } from "./types";

export const getChunks = <T>(items: readonly T[], chunkSize = 300): T[][] => {
  logger.info({ message: `Chunk size: ${chunkSize}` });

  const chunksArray = [];
  const totalItems = items.length;
  for (let i = 0; i < totalItems; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunksArray.push(chunk);
  }
  logger.info({ message: `Chunk array: ${JSON.stringify(chunksArray)}` });
  return chunksArray;
};

export const getIndexOperation = <T>(
  indexName: string,
  document: T,
  id: string
): [IndexOperation, T] => {
  return [
    {
      index: { _index: indexName, _id: id }
    },
    document
  ];
};

export const getDeleteOperation = (
  indexName: string,
  id: string
): [DeleteOperation] => {
  return [
    {
      delete: { _index: indexName, _id: id }
    }
  ];
};

export const performBulkOperations = async <T>(
  client: Client,
  operations: (DeleteOperation | IndexOperation | T)[][],
  index: string
) => {
  // Having to do this synchronously as we are seeing errors and ES dropping
  // (partially or fully) requests and need to make sure this is working before
  // we make it asynchronous again.
  for (const bulkOperation of operations) {
    const response: BulkApiResponse = await client.bulk({
      index,
      refresh: true,
      body: bulkOperation
    });

    if (response.body.errors) {
      response.body.items
        .filter((item) => item.index?.error || item.delete?.error)
        .forEach((item) => {
          logger.error({
            message: `Failed to index ${
              item.index ? item.index._id : item.delete!._id
            } with error ${
              item.index
                ? JSON.stringify(item.index.error, null, 2)
                : JSON.stringify(item.delete!.error, null, 2)
            }`
          });
        });
    }
    logger.info({
      message: `bulk response body items: ${JSON.stringify(
        response.body.items
      )}`
    });
  }
};
