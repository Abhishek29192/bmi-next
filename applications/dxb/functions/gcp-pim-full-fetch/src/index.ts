import { PubSub, Topic } from "@google-cloud/pubsub";
import { Request, Response } from "express";
import logger from "@bmi-digital/functions-logger";
import { fetchData } from "@bmi/pim-api";
import {
  PimTypes,
  ProductsApiResponse,
  SystemsApiResponse
} from "@bmi/pim-types";
import { FullFetchRequest } from "./types";

const { TRANSITIONAL_TOPIC_NAME, GCP_PROJECT_ID } = process.env;

const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
let topicPublisher: Topic;
const getTopicPublisher = () => {
  if (!topicPublisher) {
    logger.error({ message: "No topicPublisher" });
    topicPublisher = pubSubClient.topic(TRANSITIONAL_TOPIC_NAME!);
  }
  logger.info({
    message: `TopicPublisher is ${topicPublisher}`
  });
  return topicPublisher;
};

async function publishMessage(
  itemType: PimTypes,
  apiResponse: ProductsApiResponse | SystemsApiResponse
) {
  // eslint-disable-next-line security/detect-object-injection
  const items =
    itemType === PimTypes.Products
      ? (apiResponse as ProductsApiResponse).products
      : (apiResponse as SystemsApiResponse).systems;
  logger.info({
    message: `Publishing UPDATED ${items.length} ${itemType.toUpperCase()}`
  });
  const messageBuffer = Buffer.from(
    JSON.stringify({
      type: "UPDATED",
      itemType: itemType.toUpperCase(),
      // eslint-disable-next-line security/detect-object-injection
      items
    })
  );

  const messageId = await getTopicPublisher().publish(messageBuffer);
  logger.info({ message: `Published: ${messageId}` });
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request<any, any, FullFetchRequest>} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const handleRequest = async (
  req: Request<any, any, FullFetchRequest>,
  res: Response
) => {
  if (!GCP_PROJECT_ID) {
    logger.error({ message: "GCP_PROJECT_ID has not been set." });
    return res.sendStatus(500);
  }

  if (!TRANSITIONAL_TOPIC_NAME) {
    logger.error({ message: "TRANSITIONAL_TOPIC_NAME has not been set." });
    return res.sendStatus(500);
  }

  const body = req.body;

  if (!body) {
    logger.error({
      message: "type, startPage and numberOfPages was not provided."
    });
    res
      .status(400)
      .send({ error: "type, startPage and numberOfPages was not provided." });
    return;
  }
  if (!body.type) {
    logger.error({ message: "type was not provided." });
    res.status(400).send({ error: "type was not provided." });
    return;
  }
  if ((!body.startPage && body.startPage !== 0) || body.startPage < 0) {
    logger.error({
      message: "startPage must be a number greater than or equal to 0."
    });
    res.status(400).send({
      error: "startPage must be a number greater than or equal to 0."
    });
    return;
  }
  if (!body.numberOfPages || body.numberOfPages < 1) {
    logger.error({ message: "numberOfPages must be a number greater than 0." });
    res
      .status(400)
      .send({ error: "numberOfPages must be a number greater than 0." });
    return;
  }

  const promises = [];
  for (let i = body.startPage; i < body.startPage + body.numberOfPages; i++) {
    const response = await fetchData(body.type, i);
    logger.info({
      message: `Fetched data for ${body.type} body type: ${response}`
    });
    const promise = publishMessage(body.type, response);
    promises.push(promise);
  }
  await Promise.all(promises);
  logger.info({
    message: `All PROMISES WITH PUBLISHED MESSAGES:  ${promises}`
  });
  res.sendStatus(200);
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
