"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const { formatCert, formatKey } = require("../utils");

const { PG_USER = "postgres", PG_TRAINING_DATABASE = "training-db" } =
  process.env;

const getFile = (file) =>
  fs.readFileSync(
    path.resolve(__dirname, `../../../services/training/src/data/${file}`),
    "utf8"
  );

const importTrainingDb = async (
  { password, host, client_key, client_cert, server_ca },
  query
) => {
  const db = getFile("training.sql");
  const dbData = getFile("training.data.sql");
  const contraints = getFile("training.contraints.sql");
  const procedure = getFile("procedure.sql");

  const PG_PORT = 5432;

  console.log(`Connecting to ${host}:${PG_PORT}`);
  console.log(
    `Connecting as user:'${PG_USER}' to db:'${PG_TRAINING_DATABASE}' database using`
  );

  const pgClient = new Client({
    connectionTimeoutMillis: 30000,
    port: parseInt(PG_PORT),
    database: PG_TRAINING_DATABASE,
    user: PG_USER,
    password,
    host,
    ssl:
      process.env.PG_SSL === "true"
        ? {
            rejectUnauthorized: process.env.PG_REJECT_UNAUTHORIZED === "true",
            ca: formatCert(server_ca).replace(/\\n/g, "\n"),
            key: formatKey(client_key).replace(/\\n/g, "\n"),
            cert: formatCert(client_cert).replace(/\\n/g, "\n")
          }
        : false
  });
  await pgClient.connect();

  console.log("************ Importing training database ******************");

  console.log("Dropping the schema");
  await pgClient.query("DROP SCHEMA IF EXISTS public CASCADE");
  console.log("Dropped");
  console.log("Creating the schema");
  await pgClient.query("CREATE SCHEMA public");
  console.log("Created");

  console.log("Importing main db");
  await pgClient.query(db);
  console.log("DB imported");
  console.log("Importing procedure");
  await pgClient.query(procedure);
  console.log("Procedure imported");

  if (query.importData === "true") {
    console.log("Importing data");
    await pgClient.query(dbData);
    console.log("Data imported");
  }

  console.log("Importing contraints");
  await pgClient.query(contraints);
  console.log("Contraints imported");

  console.log("************ Training database imported ******************");
};

module.exports = { importTrainingDb };
