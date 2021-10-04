"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const getFile = (file) =>
  fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`), "utf8");

async function main() {
  const db = getFile("training.sql");
  const dbData = getFile("training.data.sql");
  const contraints = getFile("training.contraints.sql");
  const procedure = getFile("procedure.sql");

  const { PG_USER, PG_DATABASE, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;

  console.log(
    `Connecting to '${PG_HOST}:${PG_PORT}' host:port as '${PG_USER}' user to '${PG_DATABASE}' database using '************' password...`
  );

  const pgClient = new Client({
    host: PG_HOST,
    port: parseInt(PG_PORT),
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    connectionTimeoutMillis: 30000
  });
  await pgClient.connect();

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

  console.log("Importing data");
  await pgClient.query(dbData);
  console.log("Data imported");

  console.log("Importing contraints");
  await pgClient.query(contraints);
  console.log("Contraints imported");

  process.exit(0);
}

main().catch((error) => {
  console.log("Error", error);
  process.exit(1);
});
