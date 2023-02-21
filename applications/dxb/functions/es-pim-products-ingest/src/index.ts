import logger from "@bmi-digital/functions-logger";
import {
  Product as EsProduct,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import { Message } from "@bmi/pub-sub-types";
import { isDefined } from "@bmi/utils";
import { deleteEsItemByCode } from "./deleteEsItemByCode";
import { updateDocuments, updateItems } from "./elasticsearch";
import { transformDocuments } from "./transformDocuments";
import { transformProduct } from "./transformProducts";
import { transformSystem } from "./transformSystems";
import { MessageFunction } from "./types";

const { MARKET_LOCALE, TAG } = process.env;

export const handleMessage: MessageFunction = async (data, context) => {
  if (!MARKET_LOCALE) {
    throw new Error("MARKET_LOCALE has not been set.");
  }

  logger.info({ message: `data: ${JSON.stringify(data)}` });
  logger.info({ message: `context: ${JSON.stringify(context)}` });

  const message: Message = data.data
    ? JSON.parse(Buffer.from(data.data as string, "base64").toString())
    : {};

  const { type, itemType, item } = message;

  if (!item) {
    logger.warning({ message: "No item received" });
    return;
  }

  logger.info({
    message: `Received message: {
    type: ${type},
    itemType: ${itemType},
    item: ${JSON.stringify(item)}
  }`
  });

  if (itemType === "CATEGORIES") {
    logger.warning({ message: "CATEGORIES is not supported." });
    return;
  }

  if (type === "DELETED") {
    await deleteEsItemByCode(item, itemType);
    return;
  }

  const getEsItems = (): (EsProduct | EsSystem)[] => {
    if (itemType === "PRODUCTS") {
      return transformProduct(item);
    }
    return [transformSystem(item)].filter(isDefined);
  };

  const esItems = getEsItems();
  if (esItems.length === 0) {
    logger.warning({
      message: `ES Products or Systems not found. Ignoring the ${type}.`
    });
    return;
  }

  const transformedDocuments = await transformDocuments(
    item,
    MARKET_LOCALE,
    TAG
  );

  // Only index anything if we could handle the incoming message data properly
  await updateItems(itemType, esItems);

  if (transformedDocuments.length === 0) {
    logger.warning({
      message: `Didn't find any assets on update event.`
    });
    return;
  }

  await updateDocuments(transformedDocuments, item.code);
};
