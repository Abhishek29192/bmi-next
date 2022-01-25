import { getEsClient, BulkApiResponse } from "@bmi/functions-es-client";
import { Operation, ProductVariant } from "./es-model";
import { EsSystem } from "./transformSystems";
import { DeleteOperation, IndexOperation } from "./types";

const { ES_INDEX_PREFIX, BATCH_SIZE = "300" } = process.env;

const getChunks = <T extends ProductVariant | EsSystem>(
  items: readonly T[]
): T[][] => {
  const chunkSize = parseInt(BATCH_SIZE);
  // eslint-disable-next-line no-console
  console.info(`Chunk size: ${chunkSize}`);

  const chunksArray = [];
  const totalProducts = items.length;
  for (var i = 0; i < totalProducts; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunksArray.push(chunk);
  }

  return chunksArray;
};

const getIndexOperation = <T extends ProductVariant | EsSystem>(
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

const getDeleteOperation = <T extends ProductVariant | EsSystem>(
  indexName: string,
  document: T
): [DeleteOperation] => {
  return [
    {
      delete: { _index: indexName, _id: document.code }
    }
  ];
};

const getBulkOperations = <T extends ProductVariant | EsSystem>(
  indexName: string,
  documents: readonly T[],
  action?: Operation
): (DeleteOperation | (IndexOperation | T))[] => {
  if (!action) {
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
  return documents.reduce<DeleteOperation[]>(
    (allOps, item) => [...allOps, ...getDeleteOperation(indexName, item)],
    []
  );
};

export const updateElasticSearch = async (
  itemType: string,
  esProducts: readonly (ProductVariant | EsSystem)[],
  action?: Operation
) => {
  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const client = await getEsClient();
  // Chunk the request to avoid exceeding ES bulk request limits.
  const bulkOperations = getChunks(esProducts).map((c) =>
    getBulkOperations(index, c, action)
  );
  // Having to do this synchronously as we are seeing errors and ES dropping
  // (partially or fully) requests and need to make sure this is working before
  // we make it asynchronous again.
  for (let bulkOperation of bulkOperations) {
    const response: BulkApiResponse = await client.bulk({
      index,
      refresh: true,
      body: bulkOperation
    });

    if (response.body.errors) {
      response.body.items
        .filter((item) => item.index?.error || item.delete?.error)
        .forEach((item) => {
          // eslint-disable-next-line no-console
          console.error(
            `Failed to index ${
              item.index ? item.index._id : item.delete!._id
            } with error ${
              item.index
                ? JSON.stringify(item.index.error, null, 2)
                : JSON.stringify(item.delete!.error, null, 2)
            }`
          );
        });
    }
  }

  const { body: count } = await client.count({ index });
  // eslint-disable-next-line no-console
  console.info("Total count:", count);
};
