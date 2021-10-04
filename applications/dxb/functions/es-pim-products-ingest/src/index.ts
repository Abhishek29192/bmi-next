import { updateElasticSearch } from "./elasticsearch";
import { getEsClient } from "./es-client";
import { ProductVariant } from "./es-model";
import { Product as PIMProduct, System } from "./pim";
import { transformProduct } from "./transformProducts";
import { EsSystem, transformSystem } from "./transformSystems";
import { MessageFunction, ProductMessage, SystemMessage } from "./types";

const { USE_LOCAL_ES, ES_CLOUD_ID, ES_USERNAME } = process.env;

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

export const handleMessage: MessageFunction = async (event, context) => {
  /* istanbul ignore next */
  if (USE_LOCAL_ES !== "true") {
    if (!ES_CLOUD_ID) {
      throw Error("ES_CLOUD_ID was not provided");
    }

    if (!ES_USERNAME) {
      throw Error("ES_USERNAME was not provided");
    }
  }
  // eslint-disable-next-line no-console
  console.info("event", event);
  // eslint-disable-next-line no-console
  console.info("context", context);

  await pingEsCluster();

  let message: ProductMessage | SystemMessage;
  /* istanbul ignore next */
  if (USE_LOCAL_ES === "true") {
    message = event.data as ProductMessage | SystemMessage;
  } else {
    // For some reason event is undefined when triggering locally
    message = event.data
      ? JSON.parse(Buffer.from(event.data as string, "base64").toString())
      : {};
  }

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
