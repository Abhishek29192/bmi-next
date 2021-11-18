import { getEsClient } from "./es-client";

const { ES_INDEX_PREFIX } = process.env;

export enum ElasticsearchIndexes {
  Products = "products",
  Systems = "systems"
}

export const deleteElasticSearchIndex = async (index: ElasticsearchIndexes) => {
  const client = await getEsClient();
  const response = await client.indices.delete({
    index: `${ES_INDEX_PREFIX}${index}`
  });
  // eslint-disable-next-line no-console
  console.log(`Successfully deleted index: ${ES_INDEX_PREFIX}${index}`);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(response, null, 4));
};
