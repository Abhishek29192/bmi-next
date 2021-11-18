import fetch from "node-fetch";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { deleteFirestoreCollection, FirestoreCollections } from "./firestore";
import {
  deleteElasticSearchIndex,
  ElasticsearchIndexes
} from "./elasticsearch";
import { fetchData, PimTypes } from "./pim";

const { BUILD_TRIGGER_ENDPOINT, FULL_FETCH_ENDPOINT } = process.env;

const triggerFullFetchBatch = async (type: PimTypes) => {
  // eslint-disable-next-line no-console
  console.log(`Batching ${type}.`);
  const response = await fetchData(type);
  const numberOfRequests = response.totalPageCount / 10;
  let lastStartPage = 0;
  for (let i = 0; i < numberOfRequests; i++) {
    const numberOfPagesLeft = response.totalPageCount - lastStartPage;
    const numberOfPages = numberOfPagesLeft > 10 ? 10 : numberOfPagesLeft;
    const systemsBatchResponse = await fetch(FULL_FETCH_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        type: type,
        startPage: lastStartPage,
        numberOfPages: numberOfPages
      })
    });

    if (!systemsBatchResponse.ok) {
      throw Error(
        `Failed to trigger full fetch patch for ${type}: ${systemsBatchResponse.statusText}`
      );
    }

    lastStartPage += 10;
  }
};

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const handleRequest: HttpFunction = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log("Clearing out data...");

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
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Error whilst trying to trigger the build.", error);
  });

  res.status(200).send("ok");
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
