import logger from "@bmi-digital/functions-logger";
import { Request, Response } from "@google-cloud/functions-framework";

const SECRET_MIN_LENGTH = 10;

export const checkEnvVariablesMissing = (response: Response) => {
  if (!process.env.ES_DOCUMENTS_INGEST_SECRET) {
    logger.error({ message: "Request secret is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.ES_INDEX_NAME_DOCUMENTS) {
    logger.error({ message: "ES_INDEX_NAME has not been set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.MANAGEMENT_ACCESS_TOKEN) {
    logger.error({ message: "Management access token is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.SPACE_ID) {
    logger.error({ message: "Space id is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "Contentful environment is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.MARKET_LOCALE) {
    logger.error({ message: "MARKET_LOCALE is not set." });
    response.sendStatus(500);
    return true;
  }
  return false;
};

export const checkAuthorization = (request: Request, response: Response) => {
  const reqSecret = process.env.ES_DOCUMENTS_INGEST_SECRET!;
  if (
    reqSecret.length < SECRET_MIN_LENGTH ||
    request.headers.authorization?.substring("Bearer ".length) !== reqSecret
  ) {
    logger.warning({ message: "Authorisation failed." });
    response.sendStatus(401);
    return true;
  }
  return false;
};

export const checkHttpMethod = (request: Request, response: Response) => {
  if (request.method !== "POST") {
    logger.warning({
      message: `Request method ${request.method} is not allowed.`
    });
    response.sendStatus(405);
    return true;
  }
  return false;
};
