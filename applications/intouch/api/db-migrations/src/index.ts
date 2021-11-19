import { config } from "dotenv";
import express from "express";

config();

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import migrate from "./migrate";

const {
  PG_USER,
  PG_PORT,
  PG_SSL_HOST,
  PG_TRAINING_DATABASE,
  PG_COMPANIES_DATABASE,
  PORT = 4001
} = process.env;

const getSecret = async (client, key) => {
  const secret = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_SECRET_PROJECT}/secrets/${key}/versions/latest`
  });

  return secret[0].payload.data.toString();
};

async function main() {
  const client = new SecretManagerServiceClient();
  const PG_COMPANIES_HOST = await getSecret(client, "COMPANIES_DB_HOST");
  const PG_TRAINING_HOST = await getSecret(client, "TRAINING_DB_HOST");
  const PG_TRAINING_PASSWORD = await getSecret(client, "TRAINING_DB_PASSWORD");
  const PG_COMPANIES_PASSWORD = await getSecret(
    client,
    "COMPANIES_DB_PASSWORD"
  );
  const PG_SSL_CLIENT_KEY = await getSecret(client, "PG_SSL_CLIENT_KEY");
  const PG_SSL_CLIENT_CERT = await getSecret(client, "PG_SSL_CLIENT_CERT");
  const PG_SSL_SERVER_CA = await getSecret(client, "PG_SSL_SERVER_CA");

  const app = express();
  app.use(express.json());

  // Init postgraphile
  app.get("/", (req, res) => {
    return res.send({
      status: "You shouldn't be here!",
      "companies-host": PG_COMPANIES_HOST,
      "training-host": PG_TRAINING_HOST
    });
  });

  app.get("/health", (req, res) => {
    return res.send({
      status: "ok"
    });
  });

  app.get("/migrate-companies-db", async (req, res) => {
    try {
      const result = await migrate({
        folder: "migration-companies",
        host: PG_COMPANIES_HOST,
        password: PG_COMPANIES_PASSWORD,
        database: PG_COMPANIES_DATABASE,
        user: PG_USER,
        port: PG_PORT,
        ssl: {
          ssl_client_key: PG_SSL_CLIENT_KEY,
          ssl_client_cert: PG_SSL_CLIENT_CERT,
          ssl_server_ca: PG_SSL_SERVER_CA,
          host: PG_SSL_HOST
        },
        req
      });

      return res.send(result);
    } catch (error) {
      return res.send({
        status: "Not Imported",
        message: error.message
      });
    }
  });

  app.get("/migrate-training-db", async (req, res) => {
    try {
      const result = await migrate({
        folder: "migration-training",
        host: PG_TRAINING_HOST,
        password: PG_TRAINING_PASSWORD,
        database: PG_TRAINING_DATABASE,
        user: PG_USER,
        port: PG_PORT,
        ssl: {
          ssl_client_key: PG_SSL_CLIENT_CERT,
          ssl_client_cert: PG_SSL_CLIENT_CERT,
          ssl_server_ca: PG_SSL_SERVER_CA,
          host: PG_SSL_HOST
        },
        req
      });

      return res.send(result);
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
