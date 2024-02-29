import logger from "@bmi-digital/functions-logger";
import fetchRetry from "@bmi/fetch-retry";
import { getEsClient } from "@bmi/functions-es-client";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

const {
  BEARER_TOKEN,
  BUILD_TRIGGER_ENDPOINT,
  ES_APIKEY,
  ES_CLOUD_ID,
  ES_INDEX_NAME_TRAININGS
} = process.env;

export const handleRequest: HttpFunction = async (req, res) => {
  if (!BEARER_TOKEN) {
    logger.error({ message: "BEARER_TOKEN was not provided" });
    return res.status(500).send({ message: "BEARER_TOKEN was not provided" });
  }

  if (!BUILD_TRIGGER_ENDPOINT) {
    logger.error({
      message: "BUILD_TRIGGER_ENDPOINT was not provided"
    });
    return res
      .status(500)
      .send({ message: "BUILD_TRIGGER_ENDPOINT was not provided" });
  }

  if (!ES_APIKEY) {
    logger.error({ message: "ES_APIKEY was not provided" });
    return res.status(500).send({ message: "ES_APIKEY was not provided" });
  }

  if (!ES_CLOUD_ID) {
    logger.error({ message: "ES_CLOUD_ID was not provided" });
    return res.status(500).send({ message: "ES_CLOUD_ID was not provided" });
  }

  if (!ES_INDEX_NAME_TRAININGS) {
    logger.error({ message: "ES_INDEX_NAME_TRAININGS was not provided" });
    return res
      .status(500)
      .send({ message: "ES_INDEX_NAME_TRAININGS was not provided" });
  }

  if (req.headers.authorization !== `Bearer ${BEARER_TOKEN}`) {
    logger.error({ message: "Authorization token is not correct" });
    return res.sendStatus(403);
  }

  try {
    const sessionsDeletedResult = await deleteOutdatedSessions();
    //triggers a new build only if the data has been deleted
    if (sessionsDeletedResult.body.deleted) {
      await triggerBuild();
    }

    return res.sendStatus(200);
  } catch (err) {
    logger.error({ message: (err as Error).message });
    return res.sendStatus(500);
  }
};

const deleteOutdatedSessions = async () => {
  const client = await getEsClient();
  return client.deleteByQuery({
    index: `${ES_INDEX_NAME_TRAININGS}_write`,
    body: {
      query: {
        range: {
          startDate: {
            lte: new Date().getTime()
          }
        }
      }
    }
  });
};

const triggerBuild = async (): Promise<void> => {
  // Constants for setting up metadata server request
  // See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
  const tokenUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${BUILD_TRIGGER_ENDPOINT}`;
  // fetch the auth token
  const tokenResponse = await fetch(tokenUrl, {
    headers: {
      "Metadata-Flavor": "Google"
    }
  });
  const token = await tokenResponse.text();
  await fetchRetry(BUILD_TRIGGER_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`
    },
    body: JSON.stringify({ isFullFetch: false })
  });
  logger.info({ message: "Build triggered successfully" });
};
