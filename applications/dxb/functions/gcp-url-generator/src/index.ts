import logger from "@bmi-digital/functions-logger";
import { Message } from "@bmi/pub-sub-types";
import type { EventFunction } from "@google-cloud/functions-framework/build/src/functions";
import { PubSub, Topic } from "@google-cloud/pubsub";
import { transformProduct } from "./productTransformer";
import { transformSystem } from "./systemTransformer";
import { PubSubMessage } from "./types";

const { GCP_PROJECT_ID, ENV_PREFIX, NON_PROD_ENV_NAME } = process.env;
export const TOPIC_NAME = `bmi-${ENV_PREFIX}-dxb-pim${
  NON_PROD_ENV_NAME && `-${NON_PROD_ENV_NAME}-`
}URLGeneration-topic`;

export const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
let topicPublisher: Topic;
const getTopicPublisher = () => {
  if (!topicPublisher) {
    topicPublisher = pubSubClient.topic(TOPIC_NAME!);
  }
  return topicPublisher;
};

export const publishMessage = async (message: PubSubMessage) => {
  try {
    const messageId = await getTopicPublisher().publishMessage({
      json: message
    });
    logger.info({
      message: `PUB SUB MESSAGE PUBLISHED: ${message}, with message id: ${messageId}`
    });
  } catch (error) {
    logger.error({ message: (error as Error).message });
  }
};

// TODO: I think these should start with "/", but was easier for them not to
export const COLLECTIONS = {
  CATEGORIES: "root/categories",
  PRODUCTS: "root/products",
  SYSTEMS: "root/systems"
};

export const handleMessage: EventFunction = async ({ data }: any) => {
  const message: Message = data
    ? JSON.parse(Buffer.from(data, "base64").toString())
    : {};

  logger.info({
    message: `WRITE: Received message [${message.type}][${
      message.itemType
    }]: ${JSON.stringify(message.item)}`
  });

  const { type, itemType, item } = message;

  const collectionPath =
    itemType in COLLECTIONS &&
    COLLECTIONS[itemType as keyof typeof COLLECTIONS];

  if (!collectionPath) {
    throw new Error(`Unrecognised itemType [${itemType}]`);
  }

  let transformedItems;
  if (itemType === "PRODUCTS") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    transformedItems = transformProduct(item);
  } else {
    transformedItems = transformSystem(item);
  }

  logger.info({
    message: `Final transformedItems: ${JSON.stringify(transformedItems)}`
  });

  await publishMessage({
    type: type,
    itemType: itemType,
    item: transformedItems
  });
};
