import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";

const { ES_INDEX_PREFIX } = process.env;

export enum ElasticsearchIndexes {
  Products = "products",
  Systems = "systems"
}

export const createElasticSearchIndex = async (index: ElasticsearchIndexes) => {
  const client = await getEsClient();
  const response = await client.indices.create({
    index: `${ES_INDEX_PREFIX}${index}`
  });
  logger.debug(response);

  logger.info({
    message: `Successfully created index: ${ES_INDEX_PREFIX}${index}`
  });
};

export const deleteElasticSearchIndex = async (index: ElasticsearchIndexes) => {
  const client = await getEsClient();
  const response = await client.indices.delete({
    index: `${ES_INDEX_PREFIX}${index}`,
    ignore_unavailable: true
  });
  logger.debug(response);

  logger.info({
    message: `Successfully deleted index: ${ES_INDEX_PREFIX}${index}`
  });
};
