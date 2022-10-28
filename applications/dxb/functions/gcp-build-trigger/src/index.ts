import logger from "@bmi-digital/functions-logger";
import { waitFor } from "@bmi/utils";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import monitoring from "@google-cloud/monitoring";
import fetch from "node-fetch";

const {
  DELAY_MILLISECONDS,
  DXB_FIRESTORE_HANDLER_FUNCTION,
  DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID,
  GCP_MONITOR_PROJECT,
  GCP_APPLICATION_PROJECT,
  METRIC_LATENCY_DELAY,
  NETLIFY_BUILD_HOOK,
  TIMEOUT_LIMIT
} = process.env;

const client = new monitoring.MetricServiceClient();
let runtime = 0;

const monitorCheck = async (
  filter: string,
  shouldBePopulated = true
): Promise<boolean> => {
  const now = new Date();
  const seconds = Math.round(now.getTime() / 1000);

  const results = await client.listTimeSeries({
    name: `projects/${GCP_MONITOR_PROJECT}`,
    filter,
    interval: {
      endTime: { seconds: seconds },
      startTime: { seconds: seconds - 540 } // 540 seconds timeout for build gcp function
    },
    view: "FULL"
  });
  if (shouldBePopulated) {
    return !!results[0].find((result) =>
      result.points?.find((point) => (point.value?.int64Value || -1) > 0)
    );
  }
  let populated = false;
  let emptied = false;
  results[0].forEach((result) => {
    result.points?.forEach((point) => {
      const pointValue = point.value?.int64Value;
      if (pointValue === 0 && populated) {
        emptied = true;
      } else if (pointValue || -1 > 0) {
        populated = true;
      }
    });
  });

  return populated && emptied;
};

// The most granular we can get is the number of deletes at a project level. Whilst not ideal, it is at least better than not at all.
const checkDocumentsDeleted = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/delete_count"`
  );

// The most granular we can get is the number of updates at a project level. Whilst not ideal, it is at least better than not at all.
const checkDocumentsUpdated = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "firestore.googleapis.com/document/write_count"`
  );

const checkFunctionsFinished = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${DXB_FIRESTORE_HANDLER_FUNCTION}"`,
    false
  );

const checkMessagesConsumedFromPubSub = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${GCP_APPLICATION_PROJECT}" AND metric.type = "pubsub.googleapis.com/subscription/num_outstanding_messages" AND resource.labels.subscription_id = "${DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID}"`,
    false
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
      message: "NETLIFY_BUILD_HOOK was not provided"
    });
    return res.sendStatus(500);
  }

  if (!TIMEOUT_LIMIT) {
    logger.error({ message: "TIMEOUT_LIMIT was not provided" });
    return res.sendStatus(500);
  }

  if (!DELAY_MILLISECONDS) {
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

  const delayMilliseconds = Number.parseInt(DELAY_MILLISECONDS);
  if (Number.isNaN(delayMilliseconds)) {
    logger.error({
      message: "DELAY_SECONDS was provided, but is not a valid number"
    });
    return res.sendStatus(500);
  }

  const metricLatencyDelay = Number.parseInt(METRIC_LATENCY_DELAY || "0");
  if (metricLatencyDelay > 0) {
    await waitFor(metricLatencyDelay);
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (runtime > timeoutLimit) {
      logger.error({
        message: `Runtime exceeded ${timeoutLimit / 1000} seconds`
      });
      return res.sendStatus(500);
    }

    const documentsDeleted = await checkDocumentsDeleted();
    const documentsUpdated = await checkDocumentsUpdated();
    const functionsFinished = await checkFunctionsFinished();
    const messagesConsumedFromPubSub = await checkMessagesConsumedFromPubSub();

    if (
      (documentsDeleted || documentsUpdated) &&
      functionsFinished &&
      messagesConsumedFromPubSub
    ) {
      logger.info({ message: "Calling Build Server..." });
      const response = await fetch(NETLIFY_BUILD_HOOK, { method: "POST" });
      logger.debug({ message: JSON.stringify(response, undefined, 2) });
      return res.sendStatus(200);
    }

    if (!documentsDeleted && !documentsUpdated) {
      logger.info({
        message: "Waiting for documents have either been deleted or updated."
      });
    }

    if (functionsFinished) {
      logger.info({ message: "Waiting for the functions to finish." });
    }

    if (messagesConsumedFromPubSub) {
      logger.info({
        message: "Messages are still on the Pub/Sub waiting to be handled."
      });
    }

    await waitFor(delayMilliseconds);
    runtime += delayMilliseconds;
    logger.debug({ message: `Running for ${runtime / 1000} seconds.` });
  }
};
