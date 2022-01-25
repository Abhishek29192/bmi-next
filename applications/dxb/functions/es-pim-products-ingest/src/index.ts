import { getEsClient } from "@bmi/functions-es-client";
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
      // eslint-disable-next-line no-console
      console.error("Elasticsearch cluster is down!");
    } else {
      // eslint-disable-next-line no-console
      console.info("Elasticsearch is connected");
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
  // eslint-disable-next-line no-console
  console.info("data", data);
  // eslint-disable-next-line no-console
  console.info("context", context);

  await pingEsCluster();

  let message: ProductMessage | SystemMessage;
  message = data.data
    ? JSON.parse(Buffer.from(data.data as string, "base64").toString())
    : {};

  const { type, itemType, items } = message;
  if (!items) {
    // eslint-disable-next-line no-console
    console.warn("No items received");
    return;
  }

  // eslint-disable-next-line no-console
  console.info("Received message", {
    type,
    itemType,
    itemsCount: items.length
  });

  const esDocuments: (ProductVariant | EsSystem)[] =
    itemType === "PRODUCTS"
      ? buildEsProducts(items as PIMProduct[])
      : buildEsSystems(items as System[]);

  if (esDocuments.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`ES Products not found. Ignoring the ${type}.`);
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
      // eslint-disable-next-line no-console
      console.error(`[ERROR]: Unrecognised message type [${type}]`);
  }
};
