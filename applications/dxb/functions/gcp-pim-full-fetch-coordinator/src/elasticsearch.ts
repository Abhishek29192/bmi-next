import { getEsClient } from "./es-client";
import { debug, info } from "./logger";

const { ES_INDEX_PREFIX } = process.env;

export enum ElasticsearchIndexes {
  Products = "products",
  Systems = "systems"
}

export const deleteElasticSearchIndex = async (index: ElasticsearchIndexes) => {
  const client = await getEsClient();
  try {
    const response = await client.indices.delete({
      index: `${ES_INDEX_PREFIX}${index}`
    });
    debug(response);
  } catch (error) {
    if (error["statusCode"] !== 404) {
      throw error;
    }
  }

  info({ message: `Successfully deleted index: ${ES_INDEX_PREFIX}${index}` });
};
