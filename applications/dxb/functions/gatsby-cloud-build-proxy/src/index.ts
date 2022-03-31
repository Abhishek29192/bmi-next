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
  if (request.method !== "POST") {
    logger.warning({
      message: `Request method ${request.method} is not allowed `
    });
    return response.sendStatus(405);
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

  await fetch(buildWebhook, {
    method: "POST",
    body: request.body,
    headers: JSON.parse(JSON.stringify(request.headers))
  });
};
