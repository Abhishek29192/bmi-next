import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import monitoring, { protos } from "@google-cloud/monitoring";
import fetch from "node-fetch";

const monitorProjectName = process.env.GCP_MONITOR_PROJECT || "not set";
const applicationProjectName = process.env.GCP_APPLICATION_PROJECT || "not set";
const firestoreHandlerFunctionName =
  process.env.DXB_FIRESTORE_HANDLER_FUNCTION || "not set";
const firestoreHandlerSubscriptionId =
  process.env.DXB_FIRESTORE_HANDLER_SUBSCRIPTION_ID || "not set";
const url = process.env.NETLIFY_BUILD_HOOK || "not set";
const timeoutLimit = process.env.TIMEOUT_LIMIT || 0;

const client = new monitoring.MetricServiceClient();
let runtime = 0;

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      runtime += ms;
      resolve();
    }, ms)
  );

const monitorCheck = async (filter: string): Promise<boolean> => {
  const now = new Date();
  const seconds = Math.round(now.getTime() / 1000);

  const results = await client.listTimeSeries({
    name: `projects/${monitorProjectName}`,
    filter,
    interval: {
      endTime: { seconds: seconds },
      startTime: { seconds: seconds - 240 }
    },
    view: protos.google.monitoring.v3.ListTimeSeriesRequest.TimeSeriesView.FULL
  });
  return results.length > 0;
};

const checkDocumentsDeleted = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${applicationProjectName}" and metric.type = "firestore.googleapis.com/document/delete_count"`
  );

const checkDocumentsUpdated = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${applicationProjectName}" AND metric.type = "firestore.googleapis.com/document/write_count"`
  );

const checkFunctionsRunning = async () =>
  monitorCheck(
    `project = "${applicationProjectName}" AND metric.type = "cloudfunctions.googleapis.com/function/active_instances" AND resource.labels.function_name="${firestoreHandlerFunctionName}"`
  );

const checkMessagesStillBeingSent = async (): Promise<boolean> =>
  monitorCheck(
    `project = "${applicationProjectName}" AND metric.type = "pubsub.googleapis.com/subscription/sent_message_count" AND resource.labels.subscription_id = "${firestoreHandlerSubscriptionId}"`
  );

export const build: HttpFunction = async (_req, res) => {
  if (!(await checkDocumentsDeleted()) && !(await checkDocumentsUpdated())) {
    // eslint-disable-next-line no-console
    console.info("No documents have been deleted or updated.");
    return res.sendStatus(304);
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const functionsRunning = await checkFunctionsRunning();
    const messagesStillBeingSent = await checkMessagesStillBeingSent();

    if (!functionsRunning && !messagesStillBeingSent) {
      // eslint-disable-next-line no-console
      console.info("Calling Build Server...");
      const response = await fetch(url, { method: "POST" });
      // eslint-disable-next-line no-console
      console.debug(response);
      return res.sendStatus(200);
    }

    if (functionsRunning) {
      // eslint-disable-next-line no-console
      console.info("Waiting for the functions to finish.");
    }

    if (messagesStillBeingSent) {
      // eslint-disable-next-line no-console
      console.info("Messages are still on the Pub/Sub waiting to be handled.");
    }

    await delay(5);
    // eslint-disable-next-line no-console
    console.debug(`Running for ${runtime} seconds.`);
  }
};
