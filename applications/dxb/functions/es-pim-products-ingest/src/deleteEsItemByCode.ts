import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";
import { DeleteItem, ObjType } from "@bmi/pub-sub-types";
import { Client } from "@elastic/elasticsearch";

type MatchData = { [key: string]: string };

const esDeleteByQuery = (client: Client, index: string, match: MatchData) => {
  client.deleteByQuery(
    {
      index: index,
      body: {
        query: {
          match: match
        }
      }
    },
    /* istanbul ignore next */
    (error, response) => {
      if (error) {
        logger.info({
          message: `[ERROR]: Status code ${response.statusCode}`
        });
        logger.error({
          message: `[ERROR]: Type - ${error.message}`
        });
      } else {
        logger.info({
          message: `Number of deleted items: ${response.body.deleted}`
        });
      }
    }
  );
};

export const deleteEsItemByCode = async (
  item: DeleteItem,
  itemType: string
) => {
  const index = `${process.env.ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const documentIndex = `${process.env.ES_INDEX_NAME_DOCUMENTS}`.toLowerCase();

  const client = await getEsClient();
  const { objType, code } = item;

  const match: MatchData =
    objType === ObjType.Base_product
      ? { "baseProduct.code": code }
      : { code: code };
  const documentsMatch: MatchData = { productBaseCode: code };

  if (objType === ObjType.Layer) {
    logger.info({
      message: "ES Systems documents do not contain field 'Layer'"
    });
    return;
  }
  //delete base product or system or layer or variant from index
  esDeleteByQuery(client, index, match);
  //delete documents related to base product or system from documentIndex
  if (objType === ObjType.Base_product || objType === ObjType.System) {
    esDeleteByQuery(client, documentIndex, documentsMatch);
  }
};
