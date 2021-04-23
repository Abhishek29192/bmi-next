import { Client } from "@elastic/elasticsearch";
import { config } from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { transformProduct } from "./transform";
import { Operation as ESOperation } from "./types/elasticSearch";
import { Product as PIMProduct } from "./types/pim";

type ProductMessage = {
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
  BATCH_SIZE = "250"
} = process.env;

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const secretManagerClient = new SecretManagerServiceClient();

let esClientCache: Client;
const getEsClient = async () => {
  if (!esClientCache) {
    const esPasswordSecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    const esPassword = esPasswordSecret[0].payload.data.toString();

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

const parseErrorMeta = (meta) => {
  const { error, status } = meta.body;
  return `[${status}]: ${JSON.stringify(error)}`;
};

// ping ES cluster
const pingEsCluster = async () => {
  // get ES client
  let client = await getEsClient();
  client.ping(function (error) {
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Elasticsearch cluster is down!");
    } else {
      // eslint-disable-next-line no-console
      console.log("Elasticsearch is connected");
    }
  });
};

const buildEsProducts = (items: readonly PIMProduct[]) => {
  return items.reduce(
    (allProducts, product) => [...allProducts, ...transformProduct(product)],
    []
  );
};

const getChunks = (esProducts: readonly PIMProduct[]) => {
  const chunkSize = parseInt(BATCH_SIZE);
  // eslint-disable-next-line no-console
  console.log(`Chunk size: ${chunkSize}`);

  const chunksArray = [];
  const totalProducts = esProducts.length;
  for (var i = 0; i < totalProducts; i += chunkSize) {
    const chunk = esProducts.slice(i, i + chunkSize);
    chunksArray.push(chunk);
  }

  return chunksArray;
};

const getBulkOperations = (
  indexName: string,
  operation: ESOperation,
  items: readonly PIMProduct[]
) => {
  return items.reduce(
    (allOps, item) => [
      ...allOps,
      { [operation]: { _index: indexName, _id: item.code } },
      item
    ],
    []
  );
};

const setItemsInElasticSearch = async (
  itemType,
  items: readonly PIMProduct[]
) => {
  // get ES client
  let client = await getEsClient();

  const esProducts = buildEsProducts(items);
  if (!esProducts || esProducts.length == 0) {
    // eslint-disable-next-line no-console
    console.warn("ES Products not found. Ignoring the Update.");
    return;
  }

  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();

  // Chunk the request to avoid exceeding ES bulk request limits.
  const responsePromises = getChunks(esProducts)
    .map((c) => getBulkOperations(index, "index", c))
    .map(
      async (body) =>
        // Ideally the requests should be sent async. However when sending bulk inserts
        // concurrently to ES, it seems to reject some requests.
        // Leaving this synchronous as there is no noticeable difference in function
        // execution time.
        await client.bulk({
          index,
          refresh: true,
          body
        })
    );

  var responses = await Promise.all(responsePromises);
  responses.forEach((r) => {
    // eslint-disable-next-line no-console
    console.log(`[UPDATED][${r.body.status}]`);
    if (r.body.errors) {
      // eslint-disable-next-line no-console
      console.error("ERROR", JSON.stringify(r.body.errors, null, 2));
    }
  });
  const { body: count } = await client.count({ index });
  // eslint-disable-next-line no-console
  console.log("Total count:", count);
};

const deleteItemsFromElasticsearch = async (itemType, items) => {
  const esProducts = buildEsProducts(items);
  if (!esProducts || esProducts.length == 0) {
    // eslint-disable-next-line no-console
    console.warn("ES Products not found. Ignoring the Delete.");
    return;
  }

  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  let client = await getEsClient();

  // Chunk the request to avoid exceeding ES bulk request limits.
  const responsePromises = getChunks(esProducts)
    .map((c) => getBulkOperations(index, "delete", c))
    .map(
      async (body) =>
        // Ideally the requests should be sent async. However when sending bulk inserts
        // concurrently to ES, it seems to reject some requests.
        // Leaving this synchronous as there is no noticeable difference in function
        // execution time.
        await client.bulk({
          index,
          refresh: true,
          body
        })
    );

  var responses = await Promise.all(responsePromises);
  responses.forEach((r) => {
    // eslint-disable-next-line no-console
    console.log(`[DELETED][${r.body.status}]`);
    if (r.body.errors) {
      // eslint-disable-next-line no-console
      console.error("ERROR", JSON.stringify(r.body.errors, null, 2));
    }
  });

  const { body: count } = await client.count({ index });
  // eslint-disable-next-line no-console
  console.log("Total count:", count);
};

export const handleMessage: ProductMessageFunction = async (event, context) => {
  // eslint-disable-next-line no-console
  console.log("event", event);
  // eslint-disable-next-line no-console
  console.log("context", context);

  await pingEsCluster();

  // For some reason event is undefined when triggering locally
  const message: ProductMessage = event
    ? event.data
      ? JSON.parse(Buffer.from(event.data, "base64").toString())
      : {}
    : context.message
    ? context.message.data
    : {};

  const { type, itemType, items } = message;
  if (!items) {
    // eslint-disable-next-line no-console
    console.log("[ERROR]: NO Items received");
    return;
  }

  // eslint-disable-next-line no-console
  console.log("Received message", {
    type,
    itemType,
    itemsCount: (items || []).length
  });

  switch (type) {
    case "UPDATED":
      await setItemsInElasticSearch(itemType, items);
      break;
    case "DELETED":
      await deleteItemsFromElasticsearch(itemType, items);
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`[ERROR]: Undercognised message type [${type}]`);
  }
};
