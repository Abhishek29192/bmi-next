import logger from "@bmi-digital/functions-logger";
import {
  Product as EsProduct,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import { getEsClient } from "@bmi/functions-es-client";
import { Product as PIMProduct, System as PimSystem } from "@bmi/pim-types";
import { Message } from "@bmi/pub-sub-types";
import { deleteESItemByCode } from "./deleteESItemByCode";
import { updateElasticSearch } from "./elasticsearch";
import { transformDocuments } from "./transformDocuments";
import { transformProduct } from "./transformProducts";
import { transformSystem } from "./transformSystems";
import { MessageFunction } from "./types";

const pingEsCluster = async () => {
  // get ES client
  const client = await getEsClient();
  client.ping((error) => {
    if (error) {
      logger.error({ message: "Elasticsearch cluster is down!" });
    } else {
      logger.info({ message: "Elasticsearch is connected" });
    }
  });
};

export const buildEsProducts = (product: PIMProduct): EsProduct[] => {
  return transformProduct(product);
};

export const buildEsSystems = (system: PimSystem): EsSystem[] => {
  return [transformSystem(system)];
};

export const handleMessage: MessageFunction = async (data, context) => {
  logger.info({ message: `data: ${JSON.stringify(data)}` });
  logger.info({ message: `context: ${JSON.stringify(context)}` });

  await pingEsCluster();

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

  const getEsDocuments = (): (EsProduct | EsSystem)[] => {
    if (type === "UPDATED") {
      if (itemType === "PRODUCTS") {
        return buildEsProducts(item as PIMProduct);
      } else if (itemType === "SYSTEMS") {
        return buildEsSystems(item as PimSystem);
      }
    }
    return [];
  };

  const esDocuments = getEsDocuments();

  if (type === "UPDATED" && esDocuments.length === 0) {
    logger.warning({
      message: `ES Products not found. Ignoring the ${type}.`
    });
    return;
  }

  const getAssets = async () => {
    if (type === "UPDATED") {
      if (itemType === "PRODUCTS" || itemType === "SYSTEMS") {
        return await transformDocuments(item as PIMProduct | PimSystem);
      }
    }
    return [];
  };

  const assets = await getAssets();

  if (type === "UPDATED" && !assets?.length) {
    logger.warning({
      message: `Didn't find any assets on update event.`
    });
  }
  const itemCode: string = "code" in item ? item.code : "";
  switch (type) {
    case "UPDATED":
      await updateElasticSearch(itemType, esDocuments, assets, itemCode);
      break;
    case "DELETED":
      await deleteESItemByCode(item, itemType);
      break;
  }
};
