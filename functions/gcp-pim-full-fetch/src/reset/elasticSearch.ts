import { Client } from "@elastic/elasticsearch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const secretManagerClient = new SecretManagerServiceClient();
const {
  ES_PASSWORD_SECRET,
  SECRET_MAN_GCP_PROJECT_NAME,
  ES_INDEX_NAME
} = process.env;

let esClientCache;
const getEsClient = async () => {
  if (!esClientCache) {
    const esPasswordSecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    const esPassword = esPasswordSecret[0].payload.data.toString();

    esClientCache = new Client({
      cloud: {
        id: process.env.ES_CLOUD_ID
      },
      auth: {
        username: process.env.ES_USERNAME,
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

const deleteElasticSearchIndex = async () => {
  var client = await getEsClient();
  return client.indices.delete({ index: ES_INDEX_NAME }).then(
    function (resp) {
      console.log(`Successfully deleted index: ${ES_INDEX_NAME}`);
      console.log(JSON.stringify(resp, null, 4));
    },
    function (err) {
      console.trace(err.message);
    }
  );
};

export { deleteElasticSearchIndex };
