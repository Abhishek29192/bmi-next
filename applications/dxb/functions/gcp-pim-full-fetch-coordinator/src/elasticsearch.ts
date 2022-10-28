import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";

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
