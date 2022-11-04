import logger from "@bmi-digital/functions-logger";
import fetchRetry from "@bmi/fetch-retry";
import { fetchData } from "@bmi/pim-api";
import { PimTypes } from "@bmi/pim-types";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch, { Response } from "node-fetch";
import { getNumberOfDocuments } from "./contentful";
import {
  createElasticSearchIndex,
  deleteElasticSearchIndex,
  ElasticsearchIndexes
} from "./elasticsearch";
import { deleteFirestoreCollection } from "./firestore";
import { FirestoreCollections } from "./firestoreCollections";

const {
  BUILD_TRIGGER_ENDPOINT,
  FULL_FETCH_ENDPOINT,
  ES_INDEX_PREFIX,
  ES_INDEX_NAME_DOCUMENTS,
  LOCALE,
  MARKET_LOCALE,
  CONTENTFUL_DELIVERY_TOKEN,
  SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  TAG
} = process.env;

// The maximum number of entries returned by the API is 1000.
// The API will throw a BadRequestError for values higher than 1000 and values other than an integer.
// The default number of entries returned by the API is 100.
const MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE = 1000;

const triggerFullFetch = async (
  type: PimTypes | "documents",
  lastStartPage: number,
  numberOfPages: number
): Promise<Response> => {
  logger.info({
    message: `Triggering fetch for pages ${lastStartPage} to ${
      lastStartPage + numberOfPages
    } of ${type}.`
  });
  const response = await fetchRetry(FULL_FETCH_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: type,
      startPage: lastStartPage,
      numberOfPages: numberOfPages
    })
  });
  logger.info({ message: `Success triggerFullFetch: ${response}.` });
  return response;
};

const triggerFullFetchBatch = async (type: PimTypes) => {
  logger.info({ message: `Batching ${type}.` });

  let response;
  try {
    response = await fetchData(type, LOCALE!);
  } catch (error) {
    if (
      (error as Error).message.indexOf(
        `Base site ${process.env.PIM_CATALOG_NAME} doesn't exist`
      ) !== -1
    ) {
      return;
    }
    throw error;
  }

  const numberOfRequests = response.totalPageCount / 10;
  let lastStartPage = 0;
  const promises: Promise<Response>[] = [];
  for (let i = 0; i < numberOfRequests; i++) {
    const numberOfPagesLeft = response.totalPageCount - lastStartPage;
    const numberOfPages = numberOfPagesLeft > 10 ? 10 : numberOfPagesLeft;
    const batchResponse = triggerFullFetch(type, lastStartPage, numberOfPages);
    promises.push(batchResponse);
    lastStartPage += 10;
  }
  await Promise.all(promises);
  logger.info({ message: `Success for triggerFullFetchBatch type: ${type}.` });
};

const triggerDocumentsFullFetchBatch = async () => {
  logger.info({ message: "Batching documents" });

  const numberOfDocuments = await getNumberOfDocuments(MARKET_LOCALE!, TAG);
  if (numberOfDocuments === 0) {
    return;
  }

  const numberOfRequests = Math.ceil(
    numberOfDocuments / MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE
  );
  const promises: Promise<Response>[] = [];
  for (let i = 0; i < numberOfRequests; i++) {
    const batchResponse = triggerFullFetch("documents", i, 1);
    promises.push(batchResponse);
  }
  await Promise.all(promises);
  logger.info({
    message: `Success for triggerFullFetchBatch type: document.`
  });
};

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const handleRequest: HttpFunction = async (req, res) => {
  if (!BUILD_TRIGGER_ENDPOINT) {
    logger.error({ message: "BUILD_TRIGGER_ENDPOINT has not been set." });
    return res.sendStatus(500);
  }

  if (!FULL_FETCH_ENDPOINT) {
    logger.error({ message: "FULL_FETCH_ENDPOINT has not been set." });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_PREFIX) {
    logger.error({ message: "ES_INDEX_PREFIX has not been set." });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_NAME_DOCUMENTS) {
    logger.error({ message: "ES_INDEX_NAME_DOCUMENTS has not been set." });
    return res.sendStatus(500);
  }

  if (!LOCALE) {
    logger.error({ message: "LOCALE has not been set." });
    return res.sendStatus(500);
  }

  if (!SPACE_ID) {
    logger.error({ message: "SPACE_ID is not set." });
    return res.sendStatus(500);
  }

  if (!CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "CONTENTFUL_ENVIRONMENT is not set." });
    return res.sendStatus(500);
  }

  if (!MARKET_LOCALE) {
    logger.error({ message: "MARKET_LOCALE has not been set." });
    return res.sendStatus(500);
  }

  if (!CONTENTFUL_DELIVERY_TOKEN) {
    logger.error({ message: "CONTENTFUL_DELIVERY_TOKEN is not set." });
    return res.sendStatus(500);
  }

  logger.info({ message: "Clearing out data..." });

  const productsIndex = `${ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`;
  const systemsIndex = `${ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`;
  const documentsIndex = ES_INDEX_NAME_DOCUMENTS;

  await deleteElasticSearchIndex(productsIndex);
  await deleteElasticSearchIndex(systemsIndex);
  await deleteElasticSearchIndex(documentsIndex);
  await createElasticSearchIndex(productsIndex);
  await createElasticSearchIndex(systemsIndex);
  await createElasticSearchIndex(documentsIndex);
  await deleteFirestoreCollection(FirestoreCollections.Products);
  await deleteFirestoreCollection(FirestoreCollections.Systems);

  await triggerFullFetchBatch(PimTypes.Products);
  await triggerFullFetchBatch(PimTypes.Systems);
  await triggerDocumentsFullFetchBatch();

  fetch(BUILD_TRIGGER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ foo: "bar" })
  }).catch((error) => {
    logger.error({
      message: `Error whilst trying to trigger the build. ${error}`
    });
  });
  logger.info({ message: "Build triggered successfully" });
  res.status(200).send("ok");
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
