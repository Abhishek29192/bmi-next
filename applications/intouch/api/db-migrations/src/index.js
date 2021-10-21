"use strict";

const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { importCompanyDb } = require("./service/company");
const { importTrainingDb } = require("./service/training");

const PORT = process.env.PORT || 4001;

const getSecret = async (client, key) => {
  const secret = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_SECRET_PROJECT}/secrets/${key}/versions/latest`
  });

  return secret[0].payload.data.toString();
};

async function main() {
  const client = new SecretManagerServiceClient();
  const PG_COMPANIES_PASSWORD = await getSecret(
    client,
    "COMPANIES_DB_PASSWORD"
  );
  const PG_COMPANIES_HOST = await getSecret(client, "COMPANIES_DB_HOST");

  const PG_TRAINING_HOST = await getSecret(client, "TRAINING_DB_HOST");
  const PG_TRAINING_PASSWORD = await getSecret(client, "TRAINING_DB_PASSWORD");

  const PG_SSL_CLIENT_KEY = await getSecret(client, "PG_SSL_CLIENT_KEY");
  const PG_SSL_CLIENT_CERT = await getSecret(client, "PG_SSL_CLIENT_CERT");
  const PG_SSL_SERVER_CA = await getSecret(client, "PG_SSL_SERVER_CA");

  const app = express();
  app.use(express.json());

  // Init postgraphile
  app.get("/", (req, res) => {
    return res.send({
      status: "You shouldn't be here!"
    });
  });

  app.get("/health", (req, res) => {
    return res.send({
      status: "ok"
    });
  });

  app.get("/migrate-companies", async (req, res) => {
    const { query } = req;
    try {
      await importCompanyDb(
        {
          password: PG_COMPANIES_PASSWORD,
          host: PG_COMPANIES_HOST,
          client_key: PG_SSL_CLIENT_KEY,
          client_cert: PG_SSL_CLIENT_CERT,
          server_ca: PG_SSL_SERVER_CA
        },
        query
      );

      return res.send({
        status: "Imported"
      });
    } catch (error) {
      return res.send({
        status: "Not Imported",
        message: error.message
      });
    }
  });
  app.get("/migrate-training", async (req, res) => {
    const { query } = req;
    try {
      await importTrainingDb(
        {
          password: PG_TRAINING_PASSWORD,
          host: PG_TRAINING_HOST,
          client_key: PG_SSL_CLIENT_KEY,
          client_cert: PG_SSL_CLIENT_CERT,
          server_ca: PG_SSL_SERVER_CA
        },
        query
      );

      return res.send({
        status: "Imported"
      });
    } catch (error) {
      return res.send({
        status: "Not Imported",
        message: error.message
      });
    }
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    return res.send(err);
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Migration service started at http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
