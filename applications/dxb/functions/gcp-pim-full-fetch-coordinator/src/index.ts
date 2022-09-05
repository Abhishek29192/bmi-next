import logger from "@bmi-digital/functions-logger";
import fetchRetry from "@bmi/fetch-retry";
import { fetchData } from "@bmi/pim-api";
import { PimTypes } from "@bmi/pim-types";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch, { Response } from "node-fetch";
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
  LOCALE
} = process.env;

const triggerFullFetch = async (
  type: PimTypes,
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

  const response = await fetchData(type, LOCALE!);
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
