import logger from "@bmi-digital/functions-logger";
import { BulkApiResponse, getEsClient } from "@bmi/functions-es-client";
import { ESContentfulDocument } from "./contentful";

export enum ElasticsearchIndexes {
  Products = "products",
  Systems = "systems"
}

export const createElasticSearchIndex = async (index: string) => {
  const client = await getEsClient();
  const response = await client.indices.create({
    index
  });
  logger.debug(response);

  logger.info({
    message: `Successfully created index: ${index}`
  });
};

export const deleteElasticSearchIndex = async (index: string) => {
  const client = await getEsClient();
  const response = await client.indices.delete({
    index,
    ignore_unavailable: true
  });
  logger.debug(response);

  logger.info({
    message: `Successfully deleted index: ${index}`
  });
};

export type IndexOperation = {
  index: {
    _index: string;
    _id: string;
  };
};

const getChunks = <T extends ESContentfulDocument>(
  items: readonly T[]
): T[][] => {
  const chunkSize = parseInt(process.env.BATCH_SIZE || "300");
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

const getIndexOperation = <T extends ESContentfulDocument>(
  indexName: string,
  document: T
): [IndexOperation, T] => {
  return [
    {
      index: { _index: indexName, _id: document.id }
    },
    document
  ];
};

const getBulkOperations = <T extends ESContentfulDocument>(
  indexName: string,
  documents: readonly T[]
) => {
  return documents.reduce(
    (allDocs, currItem) => [
      ...allDocs,
      ...getIndexOperation(indexName, currItem)
    ],
    [] as (IndexOperation | T)[]
  );
};

export const performBulkIndexing = async (items: ESContentfulDocument[]) => {
  const client = await getEsClient();
  const index = process.env.ES_INDEX_NAME_DOCUMENTS;

  const bulkOperations = getChunks(items).map((chunk) =>
    getBulkOperations(index!, chunk)
  );

  for (const bulkOperation of bulkOperations) {
    const response: BulkApiResponse = await client.bulk({
      index,
      refresh: true,
      body: bulkOperation
    });

    if (response.body.errors) {
      /* istanbul ignore next */
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
