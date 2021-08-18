import path from "path";
import { config as loadConfig } from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const { NODE_ENV = "development" } = process.env;

loadConfig({
  path: path.join(__dirname, "..", `.env.${NODE_ENV}`)
});

const {
  GCP_PROJECT_ID,
  FIRESTORE_ROOT_COLLECTION,
  SECRET_MAN_GCP_PROJECT_NAME
} = process.env;

const secretManagerClient = new SecretManagerServiceClient();

export const config = {
  NODE_ENV,
  GCP_PROJECT_ID,
  FIRESTORE_ROOT_COLLECTION
};

type Secrets = "googleYoutubeApiKeySecret" | "bearerTokenSecret";

type SecretsList = Record<Secrets, string>;

const cache: Partial<SecretsList> = {};

const getSecret = async (secretName: string) => {
  // eslint-disable-next-line security/detect-object-injection
  if (cache[secretName]) return cache[secretName];
  const [secretResponse] = await secretManagerClient.accessSecretVersion({
    // eslint-disable-next-line security/detect-object-injection
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
  });

  if (
    !secretResponse ||
    !secretResponse.payload ||
    !secretResponse.payload.data
  ) {
    throw Error(`Unable to get ${secretName} secret key.`);
  }

  const secret = secretResponse.payload.data.toString();
  // eslint-disable-next-line security/detect-object-injection
  cache[secretName] = secret;
  return secret;
};

export const getSecrets = async (): Promise<SecretsList> => {
  if (NODE_ENV === "development") {
    return {
      googleYoutubeApiKeySecret: process.env.GOOGLE_YOUTUBE_API_KEY_SECRET,
      bearerTokenSecret: process.env.BEARER_TOKEN_SECRET
    };
  }

  return {
    googleYoutubeApiKeySecret: await getSecret(
      process.env.GOOGLE_YOUTUBE_API_KEY_SECRET
    ),
    bearerTokenSecret: await getSecret(process.env.BEARER_TOKEN_SECRET)
  };
};
