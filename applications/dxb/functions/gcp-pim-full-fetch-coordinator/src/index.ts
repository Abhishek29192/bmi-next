import fetch, { Response } from "node-fetch";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import logger from "@bmi/functions-logger";
import { fetchData } from "@bmi/pim-api";
import { PimTypes } from "@bmi/pim-types";
import { deleteFirestoreCollection } from "./firestore";
import {
  deleteElasticSearchIndex,
  ElasticsearchIndexes
} from "./elasticsearch";
import { FirestoreCollections } from "./firestoreCollections";

const { BUILD_TRIGGER_ENDPOINT, FULL_FETCH_ENDPOINT } = process.env;

const triggerFullFetchBatch = async (type: PimTypes) => {
  logger.info({ message: `Batching ${type}.` });

  const response = await fetchData(type);
  const numberOfRequests = response.totalPageCount / 10;
  let lastStartPage = 0;
  const promises: Promise<Response>[] = [];
  for (let i = 0; i < numberOfRequests; i++) {
    const numberOfPagesLeft = response.totalPageCount - lastStartPage;
    const numberOfPages = numberOfPagesLeft > 10 ? 10 : numberOfPagesLeft;
    logger.info({
      message: `Triggering fetch for pages ${lastStartPage} to ${
        lastStartPage + numberOfPages
      } of ${type}.`
    });
    const systemsBatchResponse = fetch(FULL_FETCH_ENDPOINT!, {
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
    systemsBatchResponse
      .then((response) => {
        if (!response.ok) {
          logger.error({
            message: `Failed to trigger full fetch patch for ${type}: ${response.statusText}`
          });
        }
      })
      .catch((reason) => {
        logger.error({ message: reason.message });
      });
    promises.push(systemsBatchResponse);

    lastStartPage += 10;
  }

  const responses = await Promise.all(promises);
  if (
    Math.ceil(numberOfRequests) !==
    responses.filter((response) => response.ok).length
  ) {
    throw new Error(`Failed to get all of the ${type} data.`);
  }
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

  logger.info({ message: "Clearing out data..." });

  await deleteElasticSearchIndex(ElasticsearchIndexes.Products);
  await deleteElasticSearchIndex(ElasticsearchIndexes.Systems);
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
  }).catch((err) => {
    logger.error({
      message: `Error whilst trying to trigger the build. ${err}`
    });
  });

  res.status(200).send("ok");
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
