import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";

const { ES_INDEX_PREFIX } = process.env;

export enum ElasticsearchIndexes {
  Products = "products",
  Systems = "systems"
}

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
