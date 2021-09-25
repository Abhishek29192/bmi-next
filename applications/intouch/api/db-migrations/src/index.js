"use strict";

const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { importDb } = require("./service/db");

const PORT = process.env.PORT || 4001;

const getSecret = async (client, key) => {
  const secret = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_SECRET_PROJECT}/secrets/${key}/versions/latest`
  });

  return secret[0].payload.data.toString();
};

async function main() {
  const client = new SecretManagerServiceClient();
  const PG_PASSWORD = await getSecret(client, "COMPANIES_DB_PASSWORD");
  const PG_HOST = await getSecret(client, "COMPANIES_DB_HOST");

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

  app.get("/migrate", async (req, res) => {
    try {
      await importDb({
        PG_PASSWORD,
        PG_HOST
      });

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
