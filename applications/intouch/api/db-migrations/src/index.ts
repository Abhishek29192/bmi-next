import { config } from "dotenv";
import express from "express";

config();

import migrate from "./migrate";

const {
  PG_USER,
  PG_PORT,
  PG_SCHEMA,
  PG_SSL_HOST,
  PG_TRAINING_DATABASE,
  PG_COMPANIES_DATABASE,
  PORT = 4001,
  PG_COMPANIES_HOST,
  PG_COMPANIES_PASSWORD,
  PG_TRAINING_HOST,
  PG_TRAINING_PASSWORD,
  PG_SSL_CLIENT_KEY,
  PG_SSL_CLIENT_CERT,
  PG_SSL_SERVER_CA
} = process.env;

async function main() {
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
        schema: PG_SCHEMA,
        ssl: {
          ssl_client_key: PG_SSL_CLIENT_KEY,
          ssl_client_cert: PG_SSL_CLIENT_CERT,
          ssl_server_ca: PG_SSL_SERVER_CA,
          ssl_host: PG_SSL_HOST
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
        schema: PG_SCHEMA,
        ssl: {
          ssl_client_key: PG_SSL_CLIENT_KEY,
          ssl_client_cert: PG_SSL_CLIENT_CERT,
          ssl_server_ca: PG_SSL_SERVER_CA,
          ssl_host: PG_SSL_HOST
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
