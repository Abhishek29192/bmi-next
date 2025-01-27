import logger from "@bmi-digital/functions-logger";
import { Asset, createClient, Entry, Environment } from "contentful-management";
import fetch from "node-fetch";
import { findBuildWebhooks } from "./find";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

const SECRET_MIN_LENGTH = 10;

let environmentCache: Environment | undefined;
const getEnvironment = async (spaceId: string): Promise<Environment> => {
  if (!environmentCache) {
    const client = createClient({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
    });
    const space = await client.getSpace(spaceId!);

    environmentCache = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT!
    );
  }
  return environmentCache;
};

export const build: HttpFunction = async (request, response) => {
  if (
    process.env.PREVIEW_BUILD === "true" &&
    !process.env.PREVIEW_BUILD_WEBHOOKS
  ) {
    logger.error({ message: "Preview build webhooks are not set." });
    return response.sendStatus(500);
  }
  if (!process.env.PREVIEW_BUILD && !process.env.BUILD_WEBHOOKS) {
    logger.error({ message: "Build webhooks are not set." });
    return response.sendStatus(500);
  }
  if (!process.env.BUILD_REQUEST) {
    logger.error({ message: "Request secret is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.MANAGEMENT_ACCESS_TOKEN) {
    logger.error({ message: "Management access token is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "Contentful environment is not set." });
    return response.sendStatus(500);
  }
  response.set("Access-Control-Allow-Origin", "*");
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST,OPTIONS");
    response.set(
      "Access-Control-Allow-Headers",
      "content-type,x-preview-auth-token,x-preview-update-source"
    );
    return response.status(204).send("");
  }
  if (request.method !== "POST") {
    logger.warning({
      message: `Request method ${request.method} is not allowed `
    });
    return response.sendStatus(405);
  }
  if (process.env.PREVIEW_BUILD && request.body === "{}") {
    logger.debug({ message: "Called from contentful sidebar." });
    return response.status(204).send("");
  }
  const reqSecret = process.env.BUILD_REQUEST;
  if (
    reqSecret.length < SECRET_MIN_LENGTH ||
    request.headers.authorization?.substring("Bearer ".length) !== reqSecret
  ) {
    logger.warning({ message: "Authorisation failed." });
    return response.sendStatus(401);
  }

  let entity: Entry | Asset | undefined;
  if (request.body?.metadata?.tags?.length) {
    entity = request.body;
  } else if (request.body?.sys?.space?.sys?.id) {
    const environment = await getEnvironment(request.body?.sys?.space?.sys?.id);

    if (request.body?.sys?.type === "DeletedEntry") {
      entity = await environment.getEntry(request.body.sys.id);
    } else if (request.body?.sys?.type === "DeletedAsset") {
      entity = await environment.getAsset(request.body.sys.id);
    }
  }

  if (!entity || !entity.metadata?.tags?.length) {
    logger.error({
      message: `Could not find Entry/Asset by id - ${request?.body?.sys?.id}`
    });
    return response.sendStatus(500);
  }

  const buildWebhooks = findBuildWebhooks(entity);
  if (!buildWebhooks) {
    logger.warning({ message: "Build webhook not found." });
    return response.sendStatus(404);
  }

  logger.info({
    message: `Triggering build on: ${JSON.stringify(buildWebhooks)}`
  });

  // GCP converts header names to lower case automatically.
  const reqHeaders = {
    "X-Contentful-Topic": request.headers["x-contentful-topic"],
    "X-Contentful-Webhook-Name": request.headers["x-contentful-webhook-name"],
    "Content-Type": "application/vnd.contentful.management.v1+json"
  };

  try {
    const responsePromises = buildWebhooks.map((webhook) =>
      fetch(webhook, {
        method: "POST",
        body: JSON.stringify(request.body),
        headers: JSON.parse(JSON.stringify(reqHeaders))
      })
    );

    const responses = await Promise.all(responsePromises);
    // Logging the status explicitly here because GCP logs 2XX (excluding 200)
    // statuses as '...Finished with status: response error'
    logger.debug({
      message: `Fetch response statuses: ${JSON.stringify(
        responses.map((r) => {
          return { URL: r.url, status: r.status };
        })
      )}`
    });
    if (responses.every((r) => r.status < 300)) {
      return response.status(200).send("successful");
    } else {
      return response.status(500).send("error");
    }
  } catch (error) {
    logger.error({ message: `Fetch error: ${error}` });
    return response.status(500).send("Server error occurred.");
  }
};
