import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";
import { DeleteItem, ObjType } from "@bmi/pub-sub-types";
import { Client } from "@elastic/elasticsearch";
import { ResponseError } from "@elastic/elasticsearch/lib/errors";

export type ItemTypes = "SYSTEMS" | "PRODUCTS";
type MatchData = { [key: string]: string };

const esDeleteByQuery = async (
  client: Client,
  index: string,
  match: MatchData
) => {
  try {
    const response = await client.deleteByQuery({
      index: index,
      body: {
        query: {
          match: match
        }
      }
    });
    logger.info({
      message: `Number of deleted items: ${response.body.deleted}`
    });
  } catch (error) {
    if (isResponseError(error)) {
      logger.error({
        message: `Status code; ${error.statusCode}, message: ${error.message}`
      });
    } else {
      logger.error({ message: `Unknown error, ${error}` });
    }
  }
};

const isResponseError = (error: unknown): error is ResponseError => {
  return error !== null && typeof error === "object" && "statusCode" in error;
};

export const deleteEsItemByCode = async (
  item: DeleteItem,
  itemType: ItemTypes
) => {
  const { objType, code } = item;
  if (objType === ObjType.Layer) {
    logger.info({
      message: "'Layer' is not indexed into ES"
    });
    return;
  }

  const client = await getEsClient();

  const match: MatchData =
    objType === ObjType.Base_product
      ? { "baseProduct.code": code }
      : { code: code };

  //delete base product or system or layer or variant from index
  const objectPromise = esDeleteByQuery(
    client,
    `${process.env.ES_INDEX_PREFIX}_${itemType}_write`.toLowerCase(),
    match
  );
  //delete documents related to base product or system from documentIndex
  if (objType === ObjType.Base_product || objType === ObjType.System) {
    await esDeleteByQuery(
      client,
      `${process.env.ES_INDEX_NAME_DOCUMENTS}_write`.toLowerCase(),
      { productBaseCode: code }
    );
  }

  await objectPromise;
};
