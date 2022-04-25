import logger from "@bmi-digital/functions-logger";
import { getSecret } from "@bmi-digital/functions-secret-client";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { createClient } from "contentful-management";
import { fromBuffer } from "file-type";
import fetch from "node-fetch";
import { Environment } from "contentful-management/dist/typings/entities/environment";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN_SECRET,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1.0");
const recaptchaTokenHeader = "X-Recaptcha-Token";

let contentfulEnvironmentCache: Environment | undefined;

const validMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png"
];

const getContentfulEnvironment = async (): Promise<Environment> => {
  if (!contentfulEnvironmentCache) {
    const managementToken = await getSecret(
      CONTENTFUL_MANAGEMENT_TOKEN_SECRET!
    );
    const client = createClient({ accessToken: managementToken });
    const space = await client.getSpace(CONTENTFUL_SPACE_ID!);
    contentfulEnvironmentCache = await space.getEnvironment(
      CONTENTFUL_ENVIRONMENT!
    );
  }
  return contentfulEnvironmentCache;
};

export const upload: HttpFunction = async (request, response) => {
  if (!CONTENTFUL_SPACE_ID) {
    logger.error({ message: "CONTENTFUL_SPACE_ID has not been set" });
    return response.sendStatus(500);
  }

  if (!CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "CONTENTFUL_ENVIRONMENT has not been set" });
    return response.sendStatus(500);
  }

  if (!CONTENTFUL_MANAGEMENT_TOKEN_SECRET) {
    logger.error({
      message: "CONTENTFUL_MANAGEMENT_TOKEN_SECRET has not been set"
    });
    return response.sendStatus(500);
  }

  if (!RECAPTCHA_SECRET_KEY) {
    logger.error({
      message: "RECAPTCHA_SECRET_KEY has not been set"
    });
    return response.sendStatus(500);
  }

  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", [
      "Content-Type",
      recaptchaTokenHeader
    ]);
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      const recaptchaToken =
        // eslint-disable-next-line security/detect-object-injection
        request.headers[recaptchaTokenHeader] ||
        request.headers[recaptchaTokenHeader.toLowerCase()];
      if (!recaptchaToken) {
        logger.error({ message: "Token not provided." });
        return response.status(400).send(Error("Token not provided."));
      }

      if (!(request.body instanceof Buffer)) {
        const error = Error("Endpoint only accepts file buffers");
        logger.error({ message: error.message });
        return response.status(400).send(error);
      }

      try {
        const recaptchaResponse = await fetch(
          `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${await getSecret(
            RECAPTCHA_SECRET_KEY
          )}&response=${recaptchaToken}`,
          { method: "POST" }
        );
        if (!recaptchaResponse.ok) {
          logger.error({
            message: `Recaptcha check failed with status ${recaptchaResponse.status} ${recaptchaResponse.statusText}.`
          });
          return response.status(400).send(Error("Recaptcha check failed."));
        }
        const json = await recaptchaResponse.json();
        if (!json.success || json.score < minimumScore) {
          logger.error({
            message: `Recaptcha check failed with error ${JSON.stringify(
              json
            )}.`
          });
          return response.status(400).send(Error("Recaptcha check failed."));
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logger.error({
          message: `Recaptcha request failed with error ${error}.`
        });
        return response.status(500).send(Error("Recaptcha request failed."));
      }

      const fileType = await fromBuffer(request.body);
      if (!fileType || validMimeTypes.indexOf(fileType.mime) === -1) {
        const error = Error(`Cannot upload files of type ${fileType?.mime}`);
        logger.error({ message: error.message });
        return response.status(406).send(error);
      }

      const environment = await getContentfulEnvironment();
      const upload = await environment.createUpload({ file: request.body });

      return response.send(upload);
    } catch (error) {
      logger.error({ message: (error as Error).message });
      return response.sendStatus(500);
    }
  }
};
