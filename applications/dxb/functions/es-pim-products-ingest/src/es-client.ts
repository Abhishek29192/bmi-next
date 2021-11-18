/**
 * Duplicated in gcp-full-fetch-coordintator. We should keep these in sync until we get shared libraries working for GCP Functions.
 */
import { Client } from "@elastic/elasticsearch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const {
  SECRET_MAN_GCP_PROJECT_NAME,
  ES_PASSWORD_SECRET,
  ES_CLOUD_ID,
  ES_USERNAME,
  USE_LOCAL_ES
} = process.env;

const secretManagerClient = new SecretManagerServiceClient();

let esClientCache: Client;

export const getEsClient = async () => {
  if (!esClientCache) {
    if (USE_LOCAL_ES === "true") {
      esClientCache = new Client({
        node: ES_CLOUD_ID
      });
      return esClientCache;
    }

    if (!ES_CLOUD_ID) {
      throw Error("ES_CLOUD_ID was not provided");
    }

    if (!ES_USERNAME) {
      throw Error("ES_USERNAME was not provided");
    }

    const esPasswordSecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    const esPassword = esPasswordSecret[0]?.payload?.data?.toString();

    if (!esPassword) {
      throw Error("Unable to retrieve ES password");
    }

    esClientCache = new Client({
      cloud: {
        id: ES_CLOUD_ID!
      },
      auth: {
        username: ES_USERNAME!,
        password: esPassword
      },
      headers: {
        "content-type": "application/json"
      }
    });

    return esClientCache;
  }
  return esClientCache;
};
