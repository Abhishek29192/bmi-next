import logger from "@bmi-digital/functions-logger";
import { Operation, Product, System } from "@bmi/elasticsearch-types";
import { BulkApiResponse, getEsClient } from "@bmi/functions-es-client";
import { DeleteOperation, IndexOperation } from "./types";

const { ES_INDEX_PREFIX, BATCH_SIZE = "300" } = process.env;

const getChunks = <T extends Product | System>(items: readonly T[]): T[][] => {
  const chunkSize = parseInt(BATCH_SIZE);
  logger.info({ message: `Chunk size: ${chunkSize}` });

  const chunksArray = [];
  const totalProducts = items.length;
  for (let i = 0; i < totalProducts; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunksArray.push(chunk);
  }
  logger.info({ message: `Chunk array: ${JSON.stringify(chunksArray)}` });
  return chunksArray;
};

const getIndexOperation = <T extends Product | System>(
  indexName: string,
  document: T
): [IndexOperation, T] => {
  return [
    {
      index: { _index: indexName, _id: document.code }
    },
    document
  ];
};

const getDeleteOperation = <T extends Product | System>(
  indexName: string,
  document: T
): [DeleteOperation] => {
  return [
    {
      delete: { _index: indexName, _id: document.code }
    }
  ];
};

const getBulkOperations = <T extends Product | System>(
  indexName: string,
  documents: readonly T[],
  action?: Operation
): (DeleteOperation | (IndexOperation | T))[] => {
  if (!action) {
    logger.info({ message: "No action passed to getBulkOperations function" });
    return documents.reduce(
      (allOps, item) => [
        ...allOps,
        ...(item.approvalStatus === "approved"
          ? getIndexOperation(indexName, item)
          : getDeleteOperation(indexName, item))
      ],
      [] as (DeleteOperation | (IndexOperation | T))[]
    );
  }
  // action is only sent in as "delete"
  logger.info({ message: "Deleted action" });
  return documents.reduce<DeleteOperation[]>(
    (allOps, item) => [...allOps, ...getDeleteOperation(indexName, item)],
    []
  );
};

export const updateElasticSearch = async (
  itemType: string,
  esProducts: readonly (Product | System)[],
  action?: Operation
) => {
  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  logger.info({ message: `update ElasticSearch by index: ${index}` });
  const client = await getEsClient();
  // Chunk the request to avoid exceeding ES bulk request limits.
  const bulkOperations = getChunks(esProducts).map((c) =>
    getBulkOperations(index, c, action)
  );
  logger.info({
    message: `all bulkOperations: ${JSON.stringify(bulkOperations)}`
  });
  // Having to do this synchronously as we are seeing errors and ES dropping
  // (partially or fully) requests and need to make sure this is working before
  // we make it asynchronous again.
  for (const bulkOperation of bulkOperations) {
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

  const {
    body: { count }
  } = await client.count({ index });
  logger.info({ message: `Total count: ${count}` });
};
