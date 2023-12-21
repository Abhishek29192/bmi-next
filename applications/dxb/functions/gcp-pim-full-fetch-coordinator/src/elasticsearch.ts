import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";

export enum ElasticsearchIndexes {
  Products = "products",
  Systems = "systems"
}

type AliasResponse = { severity: string } & {
  [itemIndex: string]: {
    alias: string;
    index: string;
    filter: string;
    "routing-index": string;
    "routing.search": string;
    is_write_index: string;
  };
};

type AliasResponseWithoutSeverity = Omit<AliasResponse, "severity">;
type AliasInfo =
  AliasResponseWithoutSeverity[keyof AliasResponseWithoutSeverity];

export const createElasticSearchIndex = async (index: string) => {
  const client = await getEsClient();
  const response = await client.indices.create({
    index
  });
  logger.debug({ message: `received response: ${response}` });

  logger.info({
    message: `Success creating index: ${index}`
  });
};

const findIndexNamesForAlias = async (aliasName: string): Promise<string[]> => {
  const client = await getEsClient();
  const indexesAssociatedWithAlias: string[] = [];
  try {
    //find current index(es) pointing to given alias
    const catAliases = await client.cat.aliases({
      name: aliasName.toLowerCase(),
      format: "json"
    });

    if (catAliases.statusCode === 200 && catAliases && catAliases.body) {
      const aliasResultBody: AliasResponse = catAliases.body as AliasResponse;

      Object.keys(aliasResultBody).forEach((key) => {
        if (key !== "severity") {
          indexesAssociatedWithAlias.push(
            // eslint-disable-next-line security/detect-object-injection
            (aliasResultBody[key] as AliasInfo).index
          );
        }
      });
    }
  } catch (e) {
    logger.error({
      message: (e as Error).message
    });
  }
  if (indexesAssociatedWithAlias.length === 0) {
    logger.error({
      message: `Index with alias: '${aliasName}' does not exist`
    });
  }

  return indexesAssociatedWithAlias;
};

export const createIndexAlias = async (
  index: string,
  indexAliasName: string
) => {
  const client = await getEsClient();

  const indexAliasNameLower = indexAliasName.toLowerCase();

  logger.info({
    message: `Finding index attached to  alias: ${indexAliasNameLower}.`
  });

  const indexesWithWriteAlias: string[] =
    await findIndexNamesForAlias(indexAliasNameLower);

  logger.info({
    message: `${indexesWithWriteAlias.length} no. of Index(es) found with alias '${indexAliasNameLower}'.`
  });

  try {
    await Promise.all(
      indexesWithWriteAlias.map(async (indexName) => {
        logger.info({
          message: `Deleting alias '${indexAliasNameLower}' from index '${indexName}'`
        });

        const response = await client.indices.deleteAlias({
          name: indexAliasNameLower,
          index: indexName
        });
        if (response.statusCode === 200) {
          logger.info({
            message: `Success deleting alias '${indexAliasNameLower}' on from index '${indexName}'`
          });
        } else {
          logger.warning({
            message: `Could not delete alias '${indexAliasNameLower}' on from index ${indexName}, Error: ${JSON.stringify(
              response.body
            )}`
          });
        }
        logger.debug({ message: `Response: ${response}` });
      })
    );
  } catch (e) {
    logger.error({
      message: (e as Error).message
    });
    throw e;
  }

  try {
    const response = await client.indices.putAlias({
      index: index,
      name: indexAliasNameLower
    });

    logger.debug({ message: `Response: ${response}` });

    logger.info({
      message: `Success creating alias '${indexAliasNameLower}' on write index '${index}'`
    });
  } catch (e) {
    logger.error({
      message: (e as Error).message
    });
    throw e;
  }
};
