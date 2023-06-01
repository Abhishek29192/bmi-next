import logger from "@bmi-digital/functions-logger";
import { waitFor } from "@bmi/utils";
import fetch from "node-fetch";
import { ElasticsearchIndexes, swapReadWriteAliases } from "./elasticsearch";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

const {
  DELAY_MILLISECONDS,
  NETLIFY_BUILD_HOOK,
  ES_INDEX_PREFIX,
  ES_INDEX_NAME_DOCUMENTS
} = process.env;

export const build: HttpFunction = async (_req, res) => {
  if (!NETLIFY_BUILD_HOOK) {
    logger.error({
      message: "NETLIFY_BUILD_HOOK was not provided"
    });
    return res.sendStatus(500);
  }

  if (!DELAY_MILLISECONDS) {
    logger.error({ message: "DELAY_SECONDS was not provided" });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_PREFIX) {
    logger.error({
      message: "ES_INDEX_PREFIX was not provided"
    });
    return res.sendStatus(500);
  }

  if (!ES_INDEX_NAME_DOCUMENTS) {
    logger.error({
      message: "ES_INDEX_NAME_DOCUMENTS was not provided"
    });
    return res.sendStatus(500);
  }

  const delayMilliseconds = Number.parseInt(DELAY_MILLISECONDS);
  if (Number.isNaN(delayMilliseconds)) {
    logger.error({
      message: "DELAY_SECONDS was provided, but is not a valid number"
    });
    return res.sendStatus(500);
  }

  await waitFor(delayMilliseconds);

  logger.debug({
    message: `received request body: ${JSON.stringify(_req.body)}`
  });

  const defaultPayload = { isFullFetch: false };
  const parseOrReturnDefaultPayload = (str: string) => {
    try {
      const parsed = JSON.parse(str);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (e) {
      return defaultPayload;
    }
    return defaultPayload;
  };
  const reqBody = parseOrReturnDefaultPayload(_req.body);
  if (reqBody.isFullFetch === true) {
    logger.debug({ message: "isFullFetch is true: swapping indexes" });

    for (const indexEntity in ElasticsearchIndexes) {
      await swapReadWriteAliases(`${ES_INDEX_PREFIX}_${indexEntity}`);
    }

    await swapReadWriteAliases(`${ES_INDEX_NAME_DOCUMENTS}`);
  }
  await fetch(NETLIFY_BUILD_HOOK, { method: "POST" });
  res.sendStatus(200);
};
