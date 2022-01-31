import logger from "@bmi/functions-logger";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import monitoring from "@google-cloud/monitoring";
import fetch from "node-fetch";

const {
  GCP_MONITOR_PROJECT,
  GCP_APPLICATION_PROJECT,
  DXB_FIRESTORE_HANDLER_FUNCTION,
  DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID,
  NETLIFY_BUILD_HOOK,
  TIMEOUT_LIMIT,
  DELAY_SECONDS
} = process.env;

const client = new monitoring.MetricServiceClient();
let runtime = 0;

const delay = (ms: number) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      runtime += ms;
      resolve();
    }, ms)
  );

const monitorCheck = async (filter: string): Promise<boolean> => {
  const now = new Date();
  const seconds = Math.round(now.getTime() / 1000);

  const results = await client.listTimeSeries({
    name: `projects/${GCP_MONITOR_PROJECT}`,
    filter,
    interval: {
      endTime: { seconds: seconds },
      startTime: { seconds: seconds - 240 }
    },
    view: "HEADERS"
  });
  return results[0].length > 0;
};

const checkDocumentsDeleted = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
  );

const checkDocumentsUpdated = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
  );

const checkFunctionsRunning = async () =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${DXB_FIRESTORE_HANDLER_FUNCTION}"`
  );

const checkMessagesStillBeingSent = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`
  );

export const build: HttpFunction = async (_req, res) => {
  if (!GCP_MONITOR_PROJECT) {
    logger.error({ message: "GCP_MONITOR_PROJECT was not provided" });
    return res.sendStatus(500);
  }

  if (!GCP_APPLICATION_PROJECT) {
    logger.error({ message: "GCP_APPLICATION_PROJECT was not provided" });
    return res.sendStatus(500);
  }

  if (!DXB_FIRESTORE_HANDLER_FUNCTION) {
    logger.error({
      message: "DXB_FIRESTORE_HANDLER_FUNCTION was not provided"
    });
    return res.sendStatus(500);
  }

  if (!DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID) {
    logger.error({
      message: "DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID was not provided"
    });
    return res.sendStatus(500);
  }

  if (!NETLIFY_BUILD_HOOK) {
    logger.error({
      message: "DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID was not provided"
    });
    return res.sendStatus(500);
  }

  if (!TIMEOUT_LIMIT) {
    logger.error({ message: "TIMEOUT_LIMIT was not provided" });
    return res.sendStatus(500);
  }

  if (!DELAY_SECONDS) {
    logger.error({ message: "DELAY_SECONDS was not provided" });
    return res.sendStatus(500);
  }

  const timeoutLimit = Number.parseInt(TIMEOUT_LIMIT);
  if (Number.isNaN(timeoutLimit)) {
    logger.error({
      message: "TIMEOUT_LIMIT was provided, but is not a valid number"
    });
    return res.sendStatus(500);
  }

  const delay_seconds = Number.parseInt(DELAY_SECONDS);
  if (Number.isNaN(delay_seconds)) {
    logger.error({
      message: "DELAY_SECONDS was provided, but is not a valid number"
    });
    return res.sendStatus(500);
  }

  if (!(await checkDocumentsDeleted()) && !(await checkDocumentsUpdated())) {
    logger.info({ message: "No documents have been deleted or updated." });
    return res.sendStatus(304);
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (runtime > timeoutLimit) {
      logger.error({ message: `Runtime exceeded ${timeoutLimit} seconds` });
      return res.sendStatus(500);
    }

    const functionsRunning = await checkFunctionsRunning();
    const messagesStillBeingSent = await checkMessagesStillBeingSent();

    if (!functionsRunning && !messagesStillBeingSent) {
      logger.info({ message: "Calling Build Server..." });
      const response = await fetch(NETLIFY_BUILD_HOOK, { method: "POST" });
      logger.debug({ message: JSON.stringify(response, undefined, 2) });
      return res.sendStatus(200);
    }

    if (functionsRunning) {
      logger.info({ message: "Waiting for the functions to finish." });
    }

    if (messagesStillBeingSent) {
      logger.info({
        message: "Messages are still on the Pub/Sub waiting to be handled."
      });
    }

    await delay(delay_seconds);
    logger.debug({ message: `Running for ${runtime} seconds.` });
  }
};
