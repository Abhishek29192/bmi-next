import logger from "@bmi-digital/functions-logger";
import { Message } from "@bmi/pub-sub-types";
import { PubSub, Topic } from "@google-cloud/pubsub";
import { transformProduct, transformSystem } from "@bmi/pim-transformation";
import {
  Product as FirestoreProduct,
  System as FirestoreSystem
} from "@bmi/firestore-types";
import { PubSubMessage } from "./types.js";
import type { EventFunction } from "@google-cloud/functions-framework";

const { PIM_PROJECT_ID, ENV_PREFIX, NON_PROD_ENV_NAME } = process.env;
export const TOPIC_NAME = `bmi-${ENV_PREFIX}-dxb-pim-${
  NON_PROD_ENV_NAME ? `${NON_PROD_ENV_NAME}-` : ""
}URLGeneration-topic`;

export const pubSubClient = new PubSub({
  projectId: PIM_PROJECT_ID
});
let topicPublisher: Topic;
const getTopicPublisher = () => {
  if (!topicPublisher) {
    topicPublisher = pubSubClient.topic(TOPIC_NAME!);
  }
  return topicPublisher;
};

export const publishMessage = async (message: PubSubMessage) => {
  const messageId = await getTopicPublisher().publishMessage({
    json: message
  });
  logger.info({
    message: `PUB SUB MESSAGE PUBLISHED: ${message}, with message id: ${messageId}`
  });
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

  if (message.itemType !== "PRODUCTS" && message.itemType !== "SYSTEMS") {
    throw new Error(`Unrecognised itemType [${message.itemType}]`);
  }

  if (message.type === "DELETED") {
    logger.info({
      message: `Ignoring delete message for ${message.itemType} - ${message.item.code}`
    });
    return;
  }

  let items: FirestoreProduct[] | FirestoreSystem[];
  if (message.itemType === "PRODUCTS") {
    items = transformProduct(message.item);
  } else {
    items = transformSystem(message.item);
  }

  if (items.length === 0) {
    logger.info({ message: "No items were returned after transformation" });
    return;
  }

  const transformedItems = items.map((item) => ({
    variantCode: item.code,
    catalog: process.env.PIM_CATALOG_NAME,
    url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${item.path}`
  }));

  logger.info({
    message: `Final transformedItems: ${JSON.stringify(transformedItems)}`
  });

  await publishMessage(transformedItems);
};
