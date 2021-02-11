import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { createClient } from "contentful-management";
import { config } from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { fromBuffer } from "file-type";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SECRET_MAN_GCP_PROJECT_NAME,
  CONTENTFUL_MANAGEMENT_TOKEN_SECRET
} = process.env;

let contentfulEnvironmentCache;
const secretManagerClient = new SecretManagerServiceClient();

const validMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png"
];

const getContentfulEnvironment = async () => {
  if (!contentfulEnvironmentCache) {
    const managementTokenSecret = await secretManagerClient.accessSecretVersion(
      {
        name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
      }
    );
    const managementToken = managementTokenSecret[0].payload.data.toString();
    const client = createClient({ accessToken: managementToken });
    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    contentfulEnvironmentCache = await space.getEnvironment(
      CONTENTFUL_ENVIRONMENT
    );
  }
  return contentfulEnvironmentCache;
};

export const upload: HttpFunction = async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      if (!(request.body instanceof Buffer)) {
        const error = Error("Endpoint only accepts file buffers");
        // eslint-disable-next-line no-console
        console.error(error);
        return response.status(400).send(error);
      }

      const fileType = await fromBuffer(request.body);
      if (!fileType || validMimeTypes.indexOf(fileType.mime) === -1) {
        const error = Error(`Cannot upload files of type ${fileType?.mime}`);
        // eslint-disable-next-line no-console
        console.error(error);
        return response.status(406).send(error);
      }

      const environment = await getContentfulEnvironment();
      const upload = await environment.createUpload({ file: request.body });

      return response.send(upload);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return response.sendStatus(500);
    }
  }
};
