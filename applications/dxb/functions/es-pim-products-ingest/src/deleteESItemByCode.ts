import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";
import { DeleteItem, ObjType } from "@bmi/pub-sub-types";

export const deleteESItemByCode = async (
  item: DeleteItem,
  itemType: string
) => {
  const index = `${process.env.ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const client = await getEsClient();
  const match =
    item.objType === ObjType.Base_product
      ? { "baseProduct.code": item.code }
      : { code: item.code };

  if (item.objType === ObjType.Layer) {
    logger.info({
      message: "ES Systems documents do not contain field 'Layer'"
    });
    return;
  }

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
