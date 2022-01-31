import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const { SECRET_MAN_GCP_PROJECT_NAME } = process.env;

const secretManagerClient = new SecretManagerServiceClient();

const secretCache: Map<string, string> = new Map();

export const getSecret = async (secretName: string) => {
  let secret = secretCache.get(secretName);
  if (!secret) {
    if (!SECRET_MAN_GCP_PROJECT_NAME) {
      throw Error("SECRET_MAN_GCP_PROJECT_NAME has not been set.");
    }

    const secretVersion = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });

    if (!secretVersion[0].payload?.data) {
      throw Error(`Unable to get secret for key ${secretName}.`);
    }

    secret = secretVersion[0].payload.data.toString();
    secretCache.set(secretName, secret);
  }
  return secret;
};
