import { Client } from "@elastic/elasticsearch";

const { ES_APIKEY, ES_CLOUD_ID, USE_LOCAL_ES } = process.env;

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

    if (!ES_APIKEY) {
      throw Error("ES_APIKEY was not provided");
    }

    esClientCache = new Client({
      cloud: {
        id: ES_CLOUD_ID!
      },
      auth: {
        apiKey: ES_APIKEY
      },
      headers: {
        "content-type": "application/json"
      }
    });

    return esClientCache;
  }
  return esClientCache;
};
