"use strict";

const { Client } = require("@elastic/elasticsearch");

const ES_INDEX_NAME = "nodetest_v3_products";

const client = new Client({
  cloud: {
    id: process.env.ES_CLOUD_ID
  },
  auth: {
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD
  },
  headers: {
    "content-type": "application/json"
  }
});

const deleteElasticSearchIndex = () => {
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

module.exports = {
  deleteElasticSearchIndex
};
