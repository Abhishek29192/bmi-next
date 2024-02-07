import logger from "@bmi-digital/functions-logger";
import { getCachedDoceboApi } from "@bmi/docebo-api";
import fetchRetry from "@bmi/fetch-retry";
import { getChunks } from "@bmi/functions-es-client";
import { fetchData } from "@bmi/pim-api";
import { PimTypes } from "@bmi/pim-types";
import { Response } from "node-fetch";
import { getNumberOfDocuments } from "./contentful";
import {
  ElasticsearchIndexes,
  createElasticSearchIndex,
  createIndexAlias
} from "./elasticsearch";
import { deleteFirestoreCollection } from "./firestore";
import { FirestoreCollections } from "./firestoreCollections";
import { generateGoogleSignedIdToken } from "./gcpAuth";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

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
  TAG,
  PULL_DOCEBO_DATA,
  ES_INDEX_NAME_TRAININGS,
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD
} = process.env;

// The maximum number of entries returned by the API is 1000.
// The API will throw a BadRequestError for values higher than 1000 and values other than an integer.
// The default number of entries returned by the API is 100.
const MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE = 1000;
const MAX_NUMBER_OF_COURSES_PER_REQUEST = 10;

const triggerFullFetch = async (
  type: PimTypes | "documents" | "trainings",
  lastStartPage: number,
  numberOfPages: number,
  trainingData?: { catalogueId: number; itemIds: string[] }
): Promise<Response> => {
  logger.info({
    message: `Triggering fetch for pages ${lastStartPage} to ${
      lastStartPage + numberOfPages
    } of ${type}.`
  });
  const authToken = await generateGoogleSignedIdToken(FULL_FETCH_ENDPOINT!);

  const response = await fetchRetry(FULL_FETCH_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${authToken}`
    },
    body: JSON.stringify({
      type: type,
      startPage: lastStartPage,
      numberOfPages: numberOfPages,
      ...(trainingData || {})
    })
  });
  logger.info({ message: `Success triggerFullFetch: ${response.status}.` });
  return response;
};

const triggerPimFullFetchBatch = async (type: PimTypes) => {
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

const triggerTrainingsFullFetchBatch = async () => {
  logger.info({ message: "Batching trainings" });
  const catalogueIds = process.env.DOCEBO_API_CATALOGUE_IDS?.split(",")
    ?.map((catalogueId) => Number(catalogueId))
    .filter(Boolean);

  if (!Array.isArray(catalogueIds) || !catalogueIds.length) {
    logger.error({ message: "Catalogue IDs are not correct" });
    return;
  }

  const doceboApi = getCachedDoceboApi();
  const catalogues = await doceboApi.fetchCatalogues({ catalogueIds });

  if (!catalogues?.length) {
    logger.error({ message: "Did not manage to pull catalogues" });
    return;
  }

  const promises = catalogues.flatMap(({ sub_items, catalogue_id }) => {
    const courseIds = sub_items.map(({ item_id }) => item_id);
    const batches = getChunks(courseIds, MAX_NUMBER_OF_COURSES_PER_REQUEST);

    logger.info({
      message: `Fetching courses for catalogue with id: ${catalogue_id}`
    });

    return batches.map((batch, index) =>
      triggerFullFetch("trainings", index + 1, 1, {
        itemIds: batch,
        catalogueId: catalogue_id
      })
    );
  });

  await Promise.all(promises);
  logger.info({
    message: "Success for triggerFullFetchBatch type: trainings."
  });
};

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const handleRequest: HttpFunction = async (req, res) => {
  const pullDoceboData = PULL_DOCEBO_DATA === "true";

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

  if (pullDoceboData && !DOCEBO_API_URL) {
    logger.error({ message: "DOCEBO_API_URL has not been set." });
    return res.sendStatus(500);
  }

  if (pullDoceboData && !DOCEBO_API_CLIENT_ID) {
    logger.error({ message: "DOCEBO_API_CLIENT_ID has not been set." });
    return res.sendStatus(500);
  }

  if (pullDoceboData && !DOCEBO_API_CLIENT_SECRET) {
    logger.error({ message: "DOCEBO_API_CLIENT_SECRET has not been set." });
    return res.sendStatus(500);
  }

  if (pullDoceboData && !DOCEBO_API_PASSWORD) {
    logger.error({
      message: "DOCEBO_API_PASSWORD has not been set."
    });
    return res.sendStatus(500);
  }

  if (pullDoceboData && !DOCEBO_API_USERNAME) {
    logger.error({ message: "DOCEBO_API_USERNAME has not been set." });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_NAME_TRAININGS) {
    logger.error({ message: "ES_INDEX_NAME_TRAININGS is not set." });
    return res.sendStatus(500);
  }

  const timeStamp = new Date().getMilliseconds();

  // this is now read alias!
  const productsIndex = `${ES_INDEX_PREFIX}${ElasticsearchIndexes.Products}`;
  const systemsIndex = `${ES_INDEX_PREFIX}${ElasticsearchIndexes.Systems}`;
  const documentsIndex = ES_INDEX_NAME_DOCUMENTS;
  const trainingsIndex = ES_INDEX_NAME_TRAININGS;

  const productsIndexNew = `${ES_INDEX_PREFIX}${timeStamp}_${ElasticsearchIndexes.Products}`;
  const systemsIndexNew = `${ES_INDEX_PREFIX}${timeStamp}_${ElasticsearchIndexes.Systems}`;
  const documentsIndexNew = `${documentsIndex}_${timeStamp}`;
  const trainingsIndexNew = `${trainingsIndex}_${timeStamp}`;

  // write alias
  const productsIndexWriteAlias = `${productsIndex}_write`;
  const systemsIndexWriteAlias = `${systemsIndex}_write`;
  const documentsIndexWriteAlias = `${documentsIndex}_write`;
  const trainingsIndexWriteAlias = `${trainingsIndex}_write`;

  // create new index with new name
  await createElasticSearchIndex(productsIndexNew);
  await createElasticSearchIndex(systemsIndexNew);
  await createElasticSearchIndex(documentsIndexNew);
  await createElasticSearchIndex(trainingsIndexNew);

  // point write alias to the newly created indexes
  await createIndexAlias(productsIndexNew, productsIndexWriteAlias);
  await createIndexAlias(systemsIndexNew, systemsIndexWriteAlias);
  await createIndexAlias(documentsIndexNew, documentsIndexWriteAlias);
  await createIndexAlias(trainingsIndexNew, trainingsIndexWriteAlias);

  await deleteFirestoreCollection(FirestoreCollections.Products);
  await deleteFirestoreCollection(FirestoreCollections.Systems);

  await triggerPimFullFetchBatch(PimTypes.Products);
  await triggerPimFullFetchBatch(PimTypes.Systems);
  await triggerDocumentsFullFetchBatch();
  if (pullDoceboData) {
    await triggerTrainingsFullFetchBatch();
  }

  try {
    const token = await generateGoogleSignedIdToken(BUILD_TRIGGER_ENDPOINT!);

    await fetchRetry(BUILD_TRIGGER_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ isFullFetch: true })
    });
  } catch (error) {
    logger.error({
      message: `Error whilst trying to trigger the build. ${error}`
    });
  }
  logger.info({ message: "Build triggered successfully" });
  res.status(200).send("ok");
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
