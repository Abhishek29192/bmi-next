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
  event: { data: string } | { data: object },
  context: {
    message: {
      data: object;
    };
  }
) => Promise<any>;

const {
  USE_LOCAL_ES,
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
    /* istanbul ignore next */
    if (USE_LOCAL_ES === "true") {
      // when debugging locally ES_CLOUD_ID must be a url `"http://localhost:9200"`
      esClientCache = new Client({
        headers: {
          "content-type": "application/json"
        },
        node: ES_CLOUD_ID
      });
      return esClientCache;
    } else {
      {
        const esPasswordSecret = await secretManagerClient.accessSecretVersion({
          name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
        });
        const esPassword = esPasswordSecret[0]?.payload?.data?.toString();

        if (!esPassword) {
          throw Error("Unable to retrieve ES password");
        }

        esClientCache = new Client({
          cloud: {
            id: ES_CLOUD_ID!
          },
          auth: {
            username: ES_USERNAME!,
            password: esPassword
          },
          headers: {
            "content-type": "application/json"
          }
        });

        return esClientCache;
      }
    }
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

const buildEsProducts = (items: readonly PIMProduct[]): ProductVariant[] => {
  return items.reduce(
    (allProducts, product) => [...allProducts, ...transformProduct(product)],
    [] as ProductVariant[]
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

type DeleteOperation = {
  delete: {
    _index: string;
    _id: string;
  };
};

type IndexOperation = {
  index: {
    _index: string;
    _id: string;
  };
};

const getIndexOperation = (
  indexName: string,
  variant: ProductVariant
): [IndexOperation, ProductVariant] => {
  return [
    {
      index: { _index: indexName, _id: variant.code }
    },
    variant
  ];
};

const getDeleteOperation = (
  indexName: string,
  variant: ProductVariant
): [DeleteOperation] => {
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
): (DeleteOperation | (IndexOperation | ProductVariant))[] => {
  if (!action) {
    return variants.reduce(
      (allOps, item) => [
        ...allOps,
        ...(item.approvalStatus === "approved"
          ? getIndexOperation(indexName, item)
          : getDeleteOperation(indexName, item))
      ],
      [] as (DeleteOperation | (IndexOperation | ProductVariant))[]
    );
  }
  // action is only sent in as "delete"
  return variants.reduce<DeleteOperation[]>(
    (allOps, item) => [...allOps, ...getDeleteOperation(indexName, item)],
    []
  );
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

  let message: ProductMessage;
  /* istanbul ignore next */
  if (USE_LOCAL_ES === "true") {
    message = event.data as ProductMessage;
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
