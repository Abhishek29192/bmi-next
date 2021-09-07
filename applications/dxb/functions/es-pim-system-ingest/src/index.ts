// import { Client } from "@elastic/elasticsearch";
import { getEsClient } from "./es-client";
import { System } from "./pim";

const {
  ES_INDEX_PREFIX,
  ES_CLOUD_ID,
  ES_USERNAME,
  BATCH_SIZE = "300"
} = process.env;

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

const getChunks = (esSystems: readonly System[]): System[][] => {
  const chunkSize = parseInt(BATCH_SIZE);
  // eslint-disable-next-line no-console
  console.info(`Chunk size: ${chunkSize}`);

  const chunksArray = [];
  const totalSystems = esSystems.length;
  for (var i = 0; i < totalSystems; i += chunkSize) {
    const chunk = esSystems.slice(i, i + chunkSize);
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
  system: System
): [IndexOperation, System] => {
  return [
    {
      index: { _index: indexName, _id: system.code }
    },
    system
  ];
};

const getDeleteOperation = (
  indexName: string,
  system: System
): [DeleteOperation] => {
  return [
    {
      delete: { _index: indexName, _id: system.code }
    }
  ];
};

export type Operation = "index" | "delete" | "create" | "update";

const getBulkOperations = (
  indexName: string,
  systems: readonly System[],
  action?: Operation
): (DeleteOperation | (IndexOperation | System))[] => {
  if (!action) {
    return systems.reduce(
      (allOps, item) => [
        ...allOps,
        ...(item.approvalStatus === "approved"
          ? getIndexOperation(indexName, item)
          : getDeleteOperation(indexName, item))
      ],
      [] as (DeleteOperation | (IndexOperation | System))[]
    );
  }
  // action is only sent in as "delete"
  return systems.reduce<DeleteOperation[]>(
    (allOps, item) => [...allOps, ...getDeleteOperation(indexName, item)],
    []
  );
};

const updateElasticSearch = async (
  itemType: string,
  esSystems: readonly System[],
  action?: Operation
) => {
  const index = `${ES_INDEX_PREFIX}_${itemType}`.toLowerCase();
  const client = await getEsClient();
  // Chunk the request to avoid exceeding ES bulk request limits.
  const bulkOperations = getChunks(esSystems).map((c) =>
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

export type SystemMessage = {
  type: string;
  itemType: string;
  items: ReadonlyArray<System>;
};

// This type is speculative at best
type SystemMessageFunction = (
  event: { data: string },
  context: {
    message: {
      data: object;
    };
  }
) => Promise<any>;

export const handleMessage: SystemMessageFunction = async (event, context) => {
  if (!ES_CLOUD_ID) {
    throw Error("ES_CLOUD_ID was not provided");
  }

  if (!ES_USERNAME) {
    throw Error("ES_USERNAME was not provided");
  }

  // eslint-disable-next-line no-console
  console.info("event", event);
  // eslint-disable-next-line no-console
  console.info("context", context);

  await pingEsCluster();

  // For some reason event is undefined when triggering locally
  const message: SystemMessage = event.data
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

  const esSystems: System[] = items as System[];

  if (esSystems.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`ES Systems not found. Ignoring the ${type}.`);
    return;
  }

  switch (type) {
    case "UPDATED":
      await updateElasticSearch(itemType, esSystems);
      break;
    case "DELETED":
      await updateElasticSearch(itemType, esSystems, "delete");
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`[ERROR]: Unrecognised message type [${type}]`);
  }
};
