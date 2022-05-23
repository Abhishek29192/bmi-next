import { Client } from "@elastic/elasticsearch";
import { getSecret } from "@bmi-digital/functions-secret-client";

const { ES_API_KEY, ES_CLOUD_ID, USE_LOCAL_ES } = process.env;

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

    if (!ES_API_KEY) {
      throw Error("ES_API_KEY was not provided");
    }

    const esApiKey = await getSecret(ES_API_KEY);

    esClientCache = new Client({
      cloud: {
        id: ES_CLOUD_ID!
      },
      auth: {
        apiKey: esApiKey
      },
      headers: {
        "content-type": "application/json"
      }
    });

    return esClientCache;
  }
  return esClientCache;
};
