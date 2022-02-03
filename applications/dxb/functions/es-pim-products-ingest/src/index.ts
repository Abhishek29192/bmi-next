import { getEsClient } from "@bmi/functions-es-client";
import logger from "@bmi/functions-logger";
import { Product as PIMProduct, System } from "@bmi/pim-types";
import { updateElasticSearch } from "./elasticsearch";
import { ProductVariant } from "./es-model";
import { transformProduct } from "./transformProducts";
import { EsSystem, transformSystem } from "./transformSystems";
import { MessageFunction, ProductMessage, SystemMessage } from "./types";

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

const buildEsProducts = (products: readonly PIMProduct[]): ProductVariant[] => {
  return products.reduce(
    (allProducts, product) => [...allProducts, ...transformProduct(product)],
    [] as ProductVariant[]
  );
};

const buildEsSystems = (systems: readonly System[]): EsSystem[] => {
  return systems.reduce(
    (allSystems, system) => allSystems.concat(transformSystem(system)),
    [] as EsSystem[]
  );
};

export const handleMessage: MessageFunction = async (data, context) => {
  logger.info({ message: `data: ${data}` });
  logger.info({ message: `context: ${context}` });

  await pingEsCluster();

  const message: ProductMessage | SystemMessage = data.data
    ? JSON.parse(Buffer.from(data.data as string, "base64").toString())
    : {};

  const { type, itemType, items } = message;
  if (!items) {
    logger.warning({ message: "No items received" });
    return;
  }

  logger.info({
    message: `Received message: {
    type: ${type},
    itemType: ${itemType},
    itemsCount: ${items.length}
  }`
  });

  const esDocuments: (ProductVariant | EsSystem)[] =
    itemType === "PRODUCTS"
      ? buildEsProducts(items as PIMProduct[])
      : buildEsSystems(items as System[]);

  if (esDocuments.length === 0) {
    logger.warning({ message: `ES Products not found. Ignoring the ${type}.` });
    return;
  }

  switch (type) {
    case "UPDATED":
      await updateElasticSearch(itemType, esDocuments);
      break;
    case "DELETED":
      await updateElasticSearch(itemType, esDocuments, "delete");
      break;
    default:
      logger.error({ message: `[ERROR]: Unrecognised message type [${type}]` });
  }
};
