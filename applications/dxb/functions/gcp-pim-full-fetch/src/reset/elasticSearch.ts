import { Client } from "@elastic/elasticsearch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const secretManagerClient = new SecretManagerServiceClient();
const {
  ES_PASSWORD_SECRET,
  SECRET_MAN_GCP_PROJECT_NAME,
  ES_INDEX_NAME,
  ES_CLOUD_ID,
  ES_USERNAME
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
        id: ES_CLOUD_ID
      },
      auth: {
        username: ES_USERNAME,
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
      // eslint-disable-next-line no-console
      console.log(`Successfully deleted index: ${ES_INDEX_NAME}`);
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(resp, null, 4));
    },
    function (err) {
      // eslint-disable-next-line no-console
      console.trace(err.message);
    }
  );
};

export { deleteElasticSearchIndex };
