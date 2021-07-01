import { Client } from "@elastic/elasticsearch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Operation, ProductVariant } from "./es-model";
import { Product as PIMProduct } from "./pim";
import { transformProduct } from "./transform";

export type ProductMessage = {
  type: string;
  itemType: string;
  items: ReadonlyArray<PIMProduct>;
};

// This type is speculative at best
type ProductMessageFunction = (
  event: { data: string },
  context: {
    message: {
      data: object;
    };
  }
) => any;

const {
  ES_INDEX_PREFIX,
  SECRET_MAN_GCP_PROJECT_NAME,
  ES_PASSWORD_SECRET,
  ES_CLOUD_ID,
  ES_USERNAME,
  BATCH_SIZE = "300"
} = process.env;

const secretManagerClient = new SecretManagerServiceClient();

let esClientCache: Client;
const getEsClient = async () => {
  if (!esClientCache) {
    const esPasswordSecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    const esPassword = esPasswordSecret[0]?.payload?.data?.toString();

    esClientCache = new Client({
      cloud: {
        id: ES_CLOUD_ID
      },
      auth: {
        username: ES_USERNAME,
        password: esPassword
      },
      headers: {
        "content-type": "application/json"
      }
    });

    return esClientCache;
  }
  return esClientCache;
};

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

const buildEsProducts = (items: readonly PIMProduct[]) => {
  return items.reduce(
    (allProducts, product) => [...allProducts, ...transformProduct(product)],
    []
  );
};

const getChunks = (
  esProducts: readonly ProductVariant[]
): ProductVariant[][] => {
  const chunkSize = parseInt(BATCH_SIZE);
  // eslint-disable-next-line no-console
  console.info(`Chunk size: ${chunkSize}`);

  const chunksArray = [];
  const totalProducts = esProducts.length;
  for (var i = 0; i < totalProducts; i += chunkSize) {
    const chunk = esProducts.slice(i, i + chunkSize);
    chunksArray.push(chunk);
  }

  return chunksArray;
};
const getIndexOperation = (indexName: string, variant: ProductVariant) => {
  return [
    {
      index: { _index: indexName, _id: variant.code }
    },
    variant
  ];
};

const getDeleteOperation = (indexName: string, variant: ProductVariant) => {
  return [
    {
      delete: { _index: indexName, _id: variant.code }
    }
  ];
};

const getBulkOperations = (
  indexName: string,
  variants: readonly ProductVariant[],
  action?: Operation
) => {
  if (!action) {
    return variants.reduce(
      (allOps, item) => [
        ...allOps,
        ...(item.approvalStatus === "approved"
          ? getIndexOperation(indexName, item)
          : getDeleteOperation(indexName, item))
      ],
      []
    );
  }

  switch (action) {
    case "delete":
      return variants.reduce(
        (allOps, item) => [...allOps, ...getDeleteOperation(indexName, item)],
        []
      );
    case "create":
    case "index":
    case "update":
      return variants.reduce(
        (allOps, item) => [...allOps, ...getIndexOperation(indexName, item)],
        []
      );
    default:
      // eslint-disable-next-line no-console
      console.error("Unexpected 'action' received");
      return null;
  }
};

const updateElasticSearch = async (
  itemType: string,
  esProducts: readonly ProductVariant[],
  action?: Operation
) => {
  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const client = await getEsClient();
  // Chunk the request to avoid exceeding ES bulk request limits.
  const bulkOperations = getChunks(esProducts).map((c) =>
    getBulkOperations(index, c, action)
  );
  // Having to do this synchronously as we are seeing errors and ES dropping
  // (partially or fully) requests and need to make sure this is working before
  // we make it asynchronous again.
  for (let bulkOperation of bulkOperations) {
    const response = await client.bulk({
      index,
      refresh: true,
      body: bulkOperation
    });

    // eslint-disable-next-line no-console
    console.info(`Response status: [${response.body.status}]`);
    if (response.body.errors) {
      // eslint-disable-next-line no-console
      console.error("ERROR", JSON.stringify(response.body.errors, null, 2));
    }
  }

  const { body: count } = await client.count({ index });
  // eslint-disable-next-line no-console
  console.info("Total count:", count);
};

export const handleMessage: ProductMessageFunction = async (event, context) => {
  // eslint-disable-next-line no-console
  console.info("event", event);
  // eslint-disable-next-line no-console
  console.info("context", context);

  await pingEsCluster();

  // For some reason event is undefined when triggering locally
  const message: ProductMessage = event.data
    ? JSON.parse(Buffer.from(event.data, "base64").toString())
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

  const esProducts: ProductVariant[] = buildEsProducts(items);

  if (esProducts.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`ES Products not found. Ignoring the ${type}.`);
    return;
  }

  switch (type) {
    case "UPDATED":
      await updateElasticSearch(itemType, esProducts);
      break;
    case "DELETED":
      await updateElasticSearch(itemType, esProducts, "delete");
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`[ERROR]: Unrecognised message type [${type}]`);
  }
};