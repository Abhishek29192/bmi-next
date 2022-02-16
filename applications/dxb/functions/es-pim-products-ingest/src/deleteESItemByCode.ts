import { DeleteItemType, ObjType } from "@bmi/gcp-pim-message-handler";
import { getEsClient } from "@bmi/functions-es-client";
import logger from "@bmi-digital/functions-logger";

export const deleteESItemByCode = async (
  items: DeleteItemType[],
  itemType: string
) => {
  const index = `${process.env.ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const client = await getEsClient();

  const deleteByQuery = async ({ code, objType }: DeleteItemType) => {
    const match =
      objType === ObjType.Base_product
        ? { "baseProduct.code": code }
        : { code: code };

    if (objType === ObjType.Layer) {
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
  return items.map(deleteByQuery);
};
