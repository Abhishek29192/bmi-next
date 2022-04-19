import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { getSecret } from "@bmi-digital/functions-secret-client";
import fetch from "node-fetch";
import logger from "@bmi-digital/functions-logger";
import { FindBuildWebhook } from "./find";

const SECRET_MIN_LENGTH = 10;

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
  if (!process.env.BUILD_REQUEST_SECRET) {
    logger.error({ message: "Request secret is not set." });
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
  const reqSecret = await getSecret(process.env.BUILD_REQUEST_SECRET!);
  if (
    reqSecret.length < SECRET_MIN_LENGTH ||
    request.headers.authorization?.substring("Bearer ".length) !== reqSecret
  ) {
    logger.warning({ message: "Authorisation failed." });
    return response.sendStatus(401);
  }

  const buildWebhook = FindBuildWebhook(request.body);
  if (!buildWebhook) {
    logger.warning({ message: "Build webhook not found." });
    return response.sendStatus(404);
  }

  logger.info({ message: `Triggering build on: ${buildWebhook}` });

  // GCP converts header names to lower case automatically.
  const reqHeaders = {
    "X-Contentful-Topic": request.headers["x-contentful-topic"],
    "X-Contentful-Webhook-Name": request.headers["x-contentful-webhook-name"],
    "Content-Type": "application/vnd.contentful.management.v1+json"
  };

  try {
    const resp = await fetch(buildWebhook, {
      method: "POST",
      body: JSON.stringify(request.body),
      headers: JSON.parse(JSON.stringify(reqHeaders))
    });

    // Logging the status explicitly here because GCP logs 2XX (excluding 200)
    // statuses as '...Finished with status: response error'
    logger.debug({
      message: `Fetch response status: ${resp.status}, ${resp.statusText}`
    });
    return response.status(resp.status).send("");
  } catch (error) {
    logger.error({ message: `Fetch error: ${error}` });
    return response.status(500).send("Server error occurred.");
  }
};
