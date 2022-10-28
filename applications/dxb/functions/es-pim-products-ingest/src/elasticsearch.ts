import logger from "@bmi-digital/functions-logger";
import {
  PimProductDocument,
  PimSystemDocument,
  Product,
  System
} from "@bmi/elasticsearch-types";
import {
  DeleteOperation,
  getChunks,
  getDeleteOperation,
  getEsClient,
  getIndexOperation,
  IndexOperation,
  performBulkOperations
} from "@bmi/functions-es-client";

export type Operation = "index" | "delete";

const getAssetsBulkOperations = (
  indexName: string,
  assets: readonly (PimSystemDocument | PimProductDocument)[]
): (IndexOperation | (PimSystemDocument | PimProductDocument))[] => {
  return assets.reduce(
    (allOps, item) => [
      ...allOps,
      ...getIndexOperation(indexName, item, item.id)
    ],
    [] as (IndexOperation | (PimSystemDocument | PimProductDocument))[]
  );
};

const getBulkOperations = <T extends Product | System>(
  indexName: string,
  documents: readonly T[]
): (DeleteOperation | (IndexOperation | T))[] =>
  documents.reduce<(DeleteOperation | (IndexOperation | T))[]>(
    (allOps, item) => [
      ...allOps,
      ...(item.approvalStatus === "approved"
        ? getIndexOperation(indexName, item, item.code)
        : getDeleteOperation(indexName, item.code))
    ],
    []
  );

export const updateItems = async (
  itemType: "PRODUCTS" | "SYSTEMS",
  items: readonly (Product | System)[]
) => {
  if (!process.env.ES_INDEX_PREFIX) {
    logger.error({ message: "ES_INDEX_PREFIX has not been set." });
    return;
  }

  const client = await getEsClient();

  const index = `${process.env.ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  // Chunk the request to avoid exceeding ES bulk request limits.
  const bulkOperations = getChunks(items).map((c) =>
    getBulkOperations(index, c)
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

export const updateDocuments = async (
  assets: readonly (PimSystemDocument | PimProductDocument)[],
  itemCode: string
) => {
  if (!process.env.ES_INDEX_NAME_DOCUMENTS) {
    logger.error({ message: "ES_INDEX_PREFIX has not been set." });
    return;
  }

  const client = await getEsClient();

  const index = `${process.env.ES_INDEX_NAME_DOCUMENTS}`.toLowerCase();

  // it is possible that the index doesnt exist at first time
  // hence this can throw error, tested using local es server
  // we need to continue to process later part..hence try/catch block
  try {
    await client.deleteByQuery({
      index: index,
      body: {
        query: {
          bool: {
            must: {
              term: { "productBaseCode.keyword": itemCode }
            }
          }
        }
      }
    });
  } catch (e) {
    logger.error({
      message: `tried to delete document by query: ${JSON.stringify(e)}`
    });
    throw e;
  }
  const bulkAssetsOperations = getChunks(assets).map((c) =>
    getAssetsBulkOperations(index, c)
  );

  logger.info({
    message: `all bulkAssetsOperations: ${JSON.stringify(bulkAssetsOperations)}`
  });

  await performBulkOperations(client, bulkAssetsOperations, index);

  const {
    body: { count }
  } = await client.count({ index });
  logger.info({ message: `Total count of Documents: ${count}` });
};
