import logger from "@bmi-digital/functions-logger";
import { fetchData } from "@bmi/pim-api";
import {
  PimTypes,
  ProductsApiResponse,
  SystemsApiResponse
} from "@bmi/pim-types";
import { isDefined } from "@bmi/utils";
import { PubSub, Topic } from "@google-cloud/pubsub";
import { Request, Response } from "express";
import { getDocuments } from "./contentful";
import { fetchDoceboData } from "./doceboDataHandler";
import { transformDocuments } from "./documentTransformer";
import { indexIntoES } from "./elasticsearch";
import { FullFetchRequest } from "./types";

const {
  TRANSITIONAL_TOPIC_NAME,
  GCP_PROJECT_ID,
  LOCALE,
  MARKET_LOCALE,
  ES_INDEX_NAME_DOCUMENTS,
  TAG,
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD,
  ES_INDEX_NAME_TRAININGS
} = process.env;

const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
let topicPublisher: Topic;
const getTopicPublisher = () => {
  if (!topicPublisher) {
    topicPublisher = pubSubClient.topic(TRANSITIONAL_TOPIC_NAME!);
  }
  return topicPublisher;
};

const publishMessage = async (
  itemType: PimTypes,
  apiResponse: ProductsApiResponse | SystemsApiResponse
) => {
  // eslint-disable-next-line security/detect-object-injection
  const items =
    itemType === PimTypes.Products
      ? (apiResponse as ProductsApiResponse).products
      : (apiResponse as SystemsApiResponse).systems;
  logger.info({
    message: `Publishing UPDATED ${items.length} ${itemType.toUpperCase()}`
  });

  await Promise.all(
    items.map(async (item) => {
      const messageId = await getTopicPublisher().publishMessage({
        json: { type: "UPDATED", itemType: itemType.toUpperCase(), item }
      });
      logger.info({ message: `Published: ${messageId}` });
    })
  );
};

const handlePimData = async (type: PimTypes, locale: string, page: number) => {
  const response = await fetchData(type, locale, page);
  logger.info({
    message: `Fetched data for ${type} body type: ${JSON.stringify(response)}`
  });
  await publishMessage(type, response);
};

const handleDocuments = async (
  locale: string,
  page: number,
  indexName: string,
  tag?: string
) => {
  const documents = await getDocuments(locale, page, tag);
  logger.info({
    message: `Fetched data for documents body type: ${JSON.stringify(
      documents
    )}`
  });
  if (documents.length === 0) {
    return;
  }
  const transformedDocuments = transformDocuments(documents);
  await indexIntoES(transformedDocuments, indexName);
};

const handleTrainings = async (
  res: Response,
  catalogueId?: number,
  itemIds?: string[]
) => {
  if (!DOCEBO_API_URL) {
    logger.error({ message: "DOCEBO_API_URL has not been set." });
    return res.sendStatus(500);
  }

  if (!DOCEBO_API_CLIENT_ID) {
    logger.error({ message: "DOCEBO_API_CLIENT_ID has not been set." });
    return res.sendStatus(500);
  }

  if (!DOCEBO_API_CLIENT_SECRET) {
    logger.error({ message: "DOCEBO_API_CLIENT_SECRET has not been set." });
    return res.sendStatus(500);
  }

  if (!DOCEBO_API_PASSWORD) {
    logger.error({
      message: "DOCEBO_API_PASSWORD has not been set."
    });
    return res.sendStatus(500);
  }

  if (!DOCEBO_API_USERNAME) {
    logger.error({ message: "DOCEBO_API_USERNAME has not been set." });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_NAME_TRAININGS) {
    logger.error({
      message: "ES_INDEX_NAME_TRAININGS has not been set."
    });
    return res.sendStatus(500);
  }

  if (!catalogueId) {
    logger.error({
      message: "catalogueId was not provided"
    });
    return res.status(400).send("catalogueId was not provided");
  }

  if (!itemIds) {
    logger.error({
      message: "itemIds field was not provided"
    });
    return res.status(400).send("itemIds field was not provided");
  }

  if (!Array.isArray(itemIds)) {
    logger.error({
      message: "itemIds should be an array"
    });
    return res.status(400).send("itemIds should be an array");
  }

  if (!itemIds.length) {
    logger.error({
      message: "training IDs were not provided"
    });
    return res.status(400).send("training IDs were not provided");
  }

  const sessions = await fetchDoceboData(catalogueId, itemIds);

  logger.info({
    message: `Transformed sessions: ${JSON.stringify(sessions)}`
  });

  await indexIntoES(sessions, ES_INDEX_NAME_TRAININGS);

  logger.info({
    message: `Docebo sessions for courses ${itemIds.join(
      ", "
    )} have been successfully indexed`
  });
  return res.sendStatus(200);
};

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

  if (!LOCALE) {
    logger.error({ message: "LOCALE has not been set." });
    return res.sendStatus(500);
  }

  if (!MARKET_LOCALE) {
    logger.error({ message: "MARKET_LOCALE has not been set." });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_NAME_DOCUMENTS) {
    logger.error({ message: "ES_INDEX_NAME_DOCUMENTS has not been set." });
    return res.sendStatus(500);
  }

  const body = req.body;

  if (!body.type) {
    logger.error({ message: "type was not provided." });
    res.status(400).send({ error: "type was not provided." });
    return;
  }

  if (!isDefined(body.startPage)) {
    logger.error({
      message: "startPage was not provided."
    });
    return res.status(400).send({ error: "startPage was not provided." });
  }
  if (!isDefined(body.numberOfPages)) {
    logger.error({
      message: "numberOfPages was not provided."
    });
    return res.status(400).send({ error: "numberOfPages was not provided." });
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
  if (body.numberOfPages < 1) {
    logger.error({ message: "numberOfPages must be a number greater than 0." });
    res
      .status(400)
      .send({ error: "numberOfPages must be a number greater than 0." });
    return;
  }

  if (body.type === "trainings") {
    return handleTrainings(res, body.catalogueId, body.itemIds);
  } else {
    const promises = [];
    for (let i = body.startPage; i < body.startPage + body.numberOfPages; i++) {
      if (body.type === PimTypes.Products || body.type === PimTypes.Systems) {
        promises.push(handlePimData(body.type, LOCALE, i));
      } else {
        promises.push(
          handleDocuments(MARKET_LOCALE, i, ES_INDEX_NAME_DOCUMENTS, TAG)
        );
      }
    }

    await Promise.all(promises);
    logger.info({
      message: `All PROMISES WITH PUBLISHED MESSAGES:  ${promises}`
    });
    res.sendStatus(200);
  }
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
