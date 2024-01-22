/* eslint-disable security/detect-object-injection */
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

const findIndexNamesForAlias = async (aliasName: string): Promise<string[]> => {
  const client = await getEsClient();
  const indexesAssociatedWithAlias: string[] = [];
  try {
    //find current index(es) pointing to given alias
    const catAliases = await client.cat.aliases({
      name: aliasName,
      format: "json"
    });

    if (catAliases.statusCode === 200 && catAliases && catAliases.body) {
      const aliasResultBody: AliasResponse = catAliases.body as AliasResponse;

      Object.keys(aliasResultBody).forEach((key) => {
        if (key !== "severity") {
          indexesAssociatedWithAlias.push(
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
    logger.warning({
      message: `No index is associated with alias '${aliasName}'`
    });
  }

  return indexesAssociatedWithAlias;
};

export const swapReadWriteAliases = async (aliasPrefix: string) => {
  if (!aliasPrefix) {
    logger.error({ message: "index alias has not been set." });
    return;
  }

  const readAlias = `${aliasPrefix.toLowerCase()}_read`;
  const writeAlias = `${aliasPrefix.toLowerCase()}_write`;

  const indexesWithReadAlias: string[] =
    await findIndexNamesForAlias(readAlias);

  // only one index should have write alias
  const indexesWithWriteAlias: string[] =
    await findIndexNamesForAlias(writeAlias);

  // full fetch co-ordinator had some problem
  //or someone has manually added `_write` alias on more than one
  //indexes, hence bail out and let user know to re-start full fetch!
  if (indexesWithWriteAlias.length > 1) {
    const errorMessage = `Multiple indexes '${JSON.stringify(
      indexesWithWriteAlias
    )}' pointing to '${writeAlias}'. Restart Full fetch`;
    logger.error({
      message: errorMessage
    });
    throw Error(errorMessage);
  }

  //one or more `read` index may be present
  const client = await getEsClient();
  try {
    //delete original read aliases from indexes
    await Promise.all(
      indexesWithReadAlias.map(async (indexName) => {
        logger.info({ message: `Deleting READ alias from '${indexName}'` });
        const deleteAliasResult = await client.indices.deleteAlias({
          name: readAlias,
          index: indexName
        });
        if (deleteAliasResult.statusCode === 200) {
          logger.info({
            message: `Success deleting READ alias '${readAlias}' from '${indexName}'`
          });
        }
      })
    );

    // add read alias to the index which is currently pinting to write alias
    await Promise.all(
      indexesWithWriteAlias.map(async (indexName) => {
        logger.info({ message: `Adding READ alias to ${indexName}` });
        const putAliasResult = await client.indices.putAlias({
          name: readAlias,
          index: indexName
        });
        if (putAliasResult.statusCode === 200) {
          logger.info({
            message: `Sucess adding READ alias '${readAlias}' to '${indexName}'`
          });
        }
      })
    );

    // delete indexes which were pointing to read alias
    await Promise.all(
      indexesWithReadAlias.map(async (indexName) => {
        logger.info({ message: `deleting Index '${indexName}'` });
        const deleteIndexResult = await client.indices.delete({
          index: indexName
        });
        if (deleteIndexResult.statusCode === 200) {
          logger.info({
            message: `Success deleting index '${indexName}'`
          });
        }
      })
    );
  } catch (e) {
    logger.error({
      message: (e as Error).message
    });
    throw e;
  }

  logger.info({
    message: `Success swapping alias '${aliasPrefix}'`
  });
};
