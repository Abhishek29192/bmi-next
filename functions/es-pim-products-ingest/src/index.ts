import { Client } from "@elastic/elasticsearch";
import { config } from "dotenv";
import { transformProduct } from "./transform";
import { Operation as ESOperation } from "./types/elasticSearch";
import { Product as PIMProduct } from "./types/pim";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

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
  ES_USERNAME
} = process.env;

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const secretManagerClient = new SecretManagerServiceClient();

let esClientCache;
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
      console.error("Elasticsearch cluster is down!");
    } else {
      console.log("Elasticsearch is connected");
    }
  });
};

const getBulkOperations = (
  indexName: string,
  operation: ESOperation,
  items: readonly PIMProduct[]
) => {
  const variants = items.reduce(
    (allProducts, product) => [...allProducts, ...transformProduct(product)],
    []
  );

  return variants.reduce(
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

  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const body = getBulkOperations(index, "index", items);

  const { body: bulkResponse } = await client.bulk({
    index,
    refresh: true,
    body
  });

  console.log(`[UPDATED][${bulkResponse.status}]`);

  if (bulkResponse.errors) {
    console.log("ERROR", JSON.stringify(bulkResponse.errors, null, 2));
  }

  const { body: count } = await client.count({ index });
  console.log("Total count:", count);
};

const deleteItemsFromElasticsearch = async (itemType, items) => {
  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const body = getBulkOperations(index, "delete", items);

  // get ES client
  let client = await getEsClient();

  const { body: bulkResponse } = await client.bulk({
    index,
    refresh: true,
    body
  });

  console.log(`[DELETED][${bulkResponse.status}]`);

  if (bulkResponse.errors) {
    console.log("[ERROR]", JSON.stringify(bulkResponse.errors, null, 2));
  }

  const { body: count } = await client.count({ index });
  console.log("Total count:", count);
};

const handleMessage: ProductMessageFunction = async (event, context) => {
  console.log("event", event);
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
    console.log("[ERROR]: NO Items received");
    return;
  }

  console.log("Received message", {
    type,
    itemType,
    itemsCount: (items || []).length
  });

  switch (type) {
    case "UPDATED":
      setItemsInElasticSearch(itemType, items);
      break;
    case "DELETED":
      deleteItemsFromElasticsearch(itemType, items);
      break;
    default:
      console.log(`[ERROR]: Undercognised message type [${type}]`);
  }
};

exports.handleMessage = handleMessage;
