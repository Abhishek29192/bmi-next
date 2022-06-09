import logger from "@bmi-digital/functions-logger";
import { getSecret } from "@bmi-digital/functions-secret-client";
import {
  copyDefaultValues,
  findIrrelevantLocales
} from "@bmi/contentful-tag-utility";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Asset, createClient, Entry, Environment } from "contentful-management";
import { findLocalesFromTag } from "./locale";

const SECRET_MIN_LENGTH = 10;

let environmentCache: Environment | undefined;
const getEnvironment = async (): Promise<Environment> => {
  if (!environmentCache) {
    const client = createClient({
      accessToken: await getSecret(process.env.MANAGEMENT_ACCESS_TOKEN_SECRET!)
    });
    const space = await client.getSpace(process.env.SPACE_ID!);

    environmentCache = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT!
    );
  }
  return environmentCache;
};

export const fill: HttpFunction = async (request, response) => {
  if (!process.env.DEFAULT_VALUES_REQUEST_SECRET) {
    logger.error({ message: "Request secret is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.MANAGEMENT_ACCESS_TOKEN_SECRET) {
    logger.error({ message: "Management access token is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.SPACE_ID) {
    logger.error({ message: "Space id is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "Contentful environment is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.MARKET_LOCALES) {
    logger.error({ message: "Market locales map not set." });
    return response.sendStatus(500);
  }
  if (request.method !== "POST") {
    logger.warning({
      message: `Request method ${request.method} is not allowed `
    });
    return response.sendStatus(405);
  }

  const reqSecret = await getSecret(process.env.DEFAULT_VALUES_REQUEST_SECRET!);
  if (
    reqSecret.length < SECRET_MIN_LENGTH ||
    request.headers.authorization?.substring("Bearer ".length) !== reqSecret
  ) {
    logger.warning({ message: "Authorisation failed." });
    return response.sendStatus(401);
  }

  const environment = await getEnvironment();

  let entity: Entry | Asset | undefined;
  if (request.body?.sys?.type === "Entry") {
    entity = await environment.getEntry(request.body.sys.id);
  } else if (request.body?.sys?.type === "Asset") {
    entity = await environment.getAsset(request.body.sys.id);
  }

  if (!entity) {
    logger.error({
      message: `Could not find Entry/Asset ${JSON.stringify(request.body)}`
    });
    return response.sendStatus(500);
  }
  const marketLocalesMap = JSON.parse(process.env.MARKET_LOCALES!);
  const marketLocales = findLocalesFromTag(entity, marketLocalesMap);

  if (!marketLocales) {
    logger.error({
      message: `Could not find current market's locales from tags: ${JSON.stringify(
        request.body
      )}`
    });
    return response.sendStatus(400);
  }

  const localesToBePopulated = await findIrrelevantLocales(
    environment,
    marketLocales
  );

  if (!localesToBePopulated) {
    logger.warning({
      message: `Could not find irrelevant locales ${JSON.stringify(
        request.body
      )}`
    });
    return response.sendStatus(400);
  }

  const status = await copyDefaultValues(
    entity,
    localesToBePopulated,
    marketLocales[0]
  );
  if (status) {
    logger.debug({ message: "Default values are set." });
    response.sendStatus(201);
  } else {
    logger.debug({ message: "Default values are already up to date." });
    response.sendStatus(200);
  }
};
