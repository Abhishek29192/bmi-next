import { Client } from "@elastic/elasticsearch";
import { getSecret } from "@bmi/functions-secret-client";

const { ES_PASSWORD_SECRET, ES_CLOUD_ID, ES_USERNAME, USE_LOCAL_ES } =
  process.env;

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

    if (!ES_PASSWORD_SECRET) {
      throw Error("ES_PASSWORD_SECRET was not provided");
    }

    const esPassword = await getSecret(ES_PASSWORD_SECRET);

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
