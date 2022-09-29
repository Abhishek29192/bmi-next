import logger from "@bmi-digital/functions-logger";
import {
  EsPIMDocumentData,
  EsPIMLinkDocumentData,
  Operation,
  Product,
  System
} from "@bmi/elasticsearch-types";
import { BulkApiResponse, getEsClient } from "@bmi/functions-es-client";
import { Client } from "@elastic/elasticsearch";
import { DeleteOperation, IndexOperation } from "./types";

const { BATCH_SIZE = "300" } = process.env;

const getChunks = <
  T extends Product | System | EsPIMDocumentData | EsPIMLinkDocumentData
>(
  items: readonly T[]
): T[][] => {
  const chunkSize = parseInt(BATCH_SIZE);
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

const getIndexOperation = <
  T extends Product | System | EsPIMDocumentData | EsPIMLinkDocumentData
>(
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

const getDeleteOperation = (
  indexName: string,
  id: string
): [DeleteOperation] => {
  return [
    {
      delete: { _index: indexName, _id: id }
    }
  ];
};

const getAssetsBulkOperations = (
  indexName: string,
  assets: readonly (EsPIMDocumentData | EsPIMLinkDocumentData)[]
): (IndexOperation | (EsPIMDocumentData | EsPIMLinkDocumentData))[] => {
  return assets.reduce(
    (allOps, item) => [
      ...allOps,
      ...getIndexOperation(indexName, item, item.id)
    ],
    [] as (IndexOperation | (EsPIMDocumentData | EsPIMLinkDocumentData))[]
  );
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
          ? getIndexOperation(indexName, item, item.code)
          : getDeleteOperation(indexName, item.code))
      ],
      [] as (DeleteOperation | (IndexOperation | T))[]
    );
  }
  // action is only sent in as "delete"
  logger.info({ message: "Deleted action" });
  return documents.reduce<DeleteOperation[]>(
    (allOps, item) => [...allOps, ...getDeleteOperation(indexName, item.code)],
    []
  );
};

const performBulkOperations = async (
  client: Client,
  operations: (
    | Product
    | System
    | DeleteOperation
    | IndexOperation
    | EsPIMDocumentData
    | EsPIMLinkDocumentData
  )[][],
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

const updateEsProducts = async (
  client: Client,
  itemType: string,
  esProducts: readonly (Product | System)[],
  action?: Operation
) => {
  if (!process.env.ES_INDEX_PREFIX) {
    logger.error({ message: "ES_INDEX_PREFIX has not been set." });
    return;
  }
  const index = `${process.env.ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  // Chunk the request to avoid exceeding ES bulk request limits.
  const bulkOperations = getChunks(esProducts).map((c) =>
    getBulkOperations(index, c, action)
  );

  logger.info({
    message: `all bulkOperations: ${JSON.stringify(bulkOperations)}`
  });

  await performBulkOperations(client, bulkOperations, index);

  const {
    body: { count }
  } = await client.count({ index });
  logger.info({ message: `Total count of ${itemType}: ${count}` });
};

const updateEsDocuments = async (
  client: Client,
  assets: readonly (EsPIMDocumentData | EsPIMLinkDocumentData)[],
  itemCode: string
) => {
  if (!process.env.ES_INDEX_NAME_DOCUMENTS) {
    logger.error({ message: "ES_INDEX_PREFIX has not been set." });
    return;
  }
  const index = `${process.env.ES_INDEX_NAME_DOCUMENTS}`.toLowerCase();
  const bulkAssetsOperations = getChunks(assets).map((c) =>
    getAssetsBulkOperations(index, c)
  );

  logger.info({
    message: `all bulkAssetsOperations: ${JSON.stringify(bulkAssetsOperations)}`
  });

  await client.deleteByQuery({
    index: index,
    body: {
      query: {
        match: {
          productBaseCode: itemCode
        }
      }
    }
  });

  await performBulkOperations(client, bulkAssetsOperations, index);

  const {
    body: { count }
  } = await client.count({ index });
  logger.info({ message: `Total count of Documents: ${count}` });
};

export const updateElasticSearch = async (
  itemType: string,
  esProducts: readonly (Product | System)[],
  assets: readonly (EsPIMDocumentData | EsPIMLinkDocumentData)[] | undefined,
  itemCode: string,
  action?: Operation
) => {
  const client = await getEsClient();

  await updateEsProducts(client, itemType, esProducts, action);

  if (assets && assets.length) {
    await updateEsDocuments(client, assets, itemCode);
  }
};
