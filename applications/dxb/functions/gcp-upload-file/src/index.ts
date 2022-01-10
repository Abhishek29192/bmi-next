import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { createClient } from "contentful-management";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { fromBuffer } from "file-type";
import fetch from "node-fetch";
import { Environment } from "contentful-management/dist/typings/entities/environment";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SECRET_MAN_GCP_PROJECT_NAME,
  CONTENTFUL_MANAGEMENT_TOKEN_SECRET,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1");
const recaptchaTokenHeader = "X-Recaptcha-Token";

let contentfulEnvironmentCache: Environment | undefined;
let recaptchaSecretKeyCache: string | undefined;
const secretManagerClient = new SecretManagerServiceClient();

const validMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png"
];

const getContentfulEnvironment = async () => {
  if (!contentfulEnvironmentCache) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- For some reason, eslint doesn't always like optional chained calls
    const managementTokenSecret = await secretManagerClient.accessSecretVersion(
      {
        name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
      }
    );
    const managementToken =
      managementTokenSecret?.[0]?.payload?.data?.toString();
    if (!managementToken) {
      // eslint-disable-next-line no-console
      console.error("Unable to find contentful management token");
      return;
    }
    const client = createClient({ accessToken: managementToken });
    const space = await client.getSpace(CONTENTFUL_SPACE_ID!);
    contentfulEnvironmentCache = await space.getEnvironment(
      CONTENTFUL_ENVIRONMENT!
    );
  }
  return contentfulEnvironmentCache;
};

const getRecaptchaSecretKey = async () => {
  if (!recaptchaSecretKeyCache) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- For some reason, eslint doesn't always like optional chained calls
    const recaptchaSecretKey = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${RECAPTCHA_SECRET_KEY}/versions/latest`
    });

    recaptchaSecretKeyCache =
      recaptchaSecretKey?.[0]?.payload?.data?.toString();

    if (!recaptchaSecretKeyCache) {
      // eslint-disable-next-line no-console
      console.error("Unable to find recaptcha secret");
      return;
    }
  }
  return recaptchaSecretKeyCache;
};

export const upload: HttpFunction = async (request, response) => {
  if (!CONTENTFUL_SPACE_ID) {
    // eslint-disable-next-line no-console
    console.error("CONTENTFUL_SPACE_ID has not been set");
    return response.status(500).send(Error("Something went wrong."));
  }

  if (!CONTENTFUL_ENVIRONMENT) {
    // eslint-disable-next-line no-console
    console.error("CONTENTFUL_ENVIRONMENT has not been set");
    return response.status(500).send(Error("Something went wrong."));
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
        // eslint-disable-next-line no-console
        console.error("Token not provided.");
        return response.status(400).send(Error("Token not provided."));
      }

      if (!(request.body instanceof Buffer)) {
        const error = Error("Endpoint only accepts file buffers");
        // eslint-disable-next-line no-console
        console.error(error);
        return response.status(400).send(error);
      }

      try {
        const recaptchaResponse = await fetch(
          `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${await getRecaptchaSecretKey()}&response=${recaptchaToken}`,
          { method: "POST" }
        );
        if (!recaptchaResponse.ok) {
          // eslint-disable-next-line no-console
          console.error(
            `Recaptcha check failed with status ${recaptchaResponse.status}.`
          );
          return response.status(400).send(Error("Recaptcha check failed."));
        }
        const json = await recaptchaResponse.json();
        if (!json.success || json.score < minimumScore) {
          // eslint-disable-next-line no-console
          console.error(
            `Recaptcha check failed with error ${JSON.stringify(json)}.`
          );
          return response.status(400).send(Error("Recaptcha check failed."));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Recaptcha request failed with error ${error}.`);
        return response.status(500).send(Error("Recaptcha request failed."));
      }

      const fileType = await fromBuffer(request.body);
      if (!fileType || validMimeTypes.indexOf(fileType.mime) === -1) {
        const error = Error(`Cannot upload files of type ${fileType?.mime}`);
        // eslint-disable-next-line no-console
        console.error(error);
        return response.status(406).send(error);
      }

      const environment = await getContentfulEnvironment();
      if (!environment) {
        // eslint-disable-next-line no-console
        console.error(
          "Contentful environment client could not be instantiated."
        );
        return response.sendStatus(500);
      }
      const upload = await environment.createUpload({ file: request.body });

      return response.send(upload);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return response.sendStatus(500);
    }
  }
};
