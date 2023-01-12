import logger from "@bmi-digital/functions-logger";
import { waitFor } from "@bmi/utils";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";

const { DELAY_MILLISECONDS, NETLIFY_BUILD_HOOK } = process.env;

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

  const delayMilliseconds = Number.parseInt(DELAY_MILLISECONDS);
  if (Number.isNaN(delayMilliseconds)) {
    logger.error({
      message: "DELAY_SECONDS was provided, but is not a valid number"
    });
    return res.sendStatus(500);
  }

  await waitFor(delayMilliseconds);
  await fetch(NETLIFY_BUILD_HOOK, { method: "POST" });
  res.sendStatus(200);
};
