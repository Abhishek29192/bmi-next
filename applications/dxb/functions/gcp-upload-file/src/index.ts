import logger from "@bmi-digital/functions-logger";
import { verifyRecaptchaToken } from "@bmi/functions-recaptcha";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { createClient } from "contentful-management";
import { Environment } from "contentful-management/dist/typings/entities/environment";
import { fromBuffer } from "file-type";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN,
  RECAPTCHA_KEY,
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
    const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_TOKEN! });
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

  if (!CONTENTFUL_MANAGEMENT_TOKEN) {
    logger.error({
      message: "CONTENTFUL_MANAGEMENT_TOKEN has not been set"
    });
    return response.sendStatus(500);
  }

  if (!RECAPTCHA_KEY) {
    logger.error({
      message: "RECAPTCHA_KEY has not been set"
    });
    return response.sendStatus(500);
  }

  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", [
      "Authorization",
      "Content-Type",
      recaptchaTokenHeader
    ]);
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      const authorizationToken = request.headers.authorization;
      const qaAuthToken = process.env.QA_AUTH_TOKEN;
      if (
        authorizationToken &&
        authorizationToken.substring("Bearer ".length) !== qaAuthToken
      ) {
        logger.error({ message: "QaAuthToken failed." });
        return response.status(400).send(Error("QaAuthToken failed."));
      }
      const recaptchaToken =
        // eslint-disable-next-line security/detect-object-injection
        request.headers[recaptchaTokenHeader] ||
        request.headers[recaptchaTokenHeader.toLowerCase()];
      if (
        (!authorizationToken && !recaptchaToken) ||
        Array.isArray(recaptchaToken)
      ) {
        logger.error({ message: "Token not provided." });
        return response.status(400).send(Error("Token not provided."));
      }

      if (!(request.body instanceof Buffer)) {
        const error = Error("Endpoint only accepts file buffers");
        logger.error({ message: error.message });
        return response.status(400).send(error);
      }

      if (!authorizationToken && recaptchaToken) {
        try {
          await verifyRecaptchaToken(
            recaptchaToken,
            RECAPTCHA_KEY,
            minimumScore
          );
        } catch (error) {
          logger.error({
            message: `Recaptcha check failed with error ${error}.`
          });
          return response.status(400).send(Error("Recaptcha check failed."));
        }
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
