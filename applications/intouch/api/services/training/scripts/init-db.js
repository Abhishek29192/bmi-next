"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const getFile = (file) => {
  return fs.readFileSync(
    path.resolve(__dirname, `../src/data/${file}`),
    "utf8"
  );
};

async function main() {
  const db = getFile("training.sql");

  const { PG_USER, DATABASE, PASSWORD, HOST, PG_PORT } = process.env;

  console.log(`Connecting to ${HOST}:${PG_PORT} as ${PG_USER}....`);
  const client = new Client({
    host: HOST,
    port: parseInt(PG_PORT),
    user: PG_USER,
    password: PASSWORD,
    database: DATABASE,
    connectionTimeoutMillis: 3000
  });
  await client.connect();

  console.log("Dropping the schema");
  await client.query("DROP SCHEMA IF EXISTS public CASCADE");
  console.log("Dropped");
  console.log("Creating the schema");
  await client.query("CREATE SCHEMA public");
  console.log("Created");

  console.log("Importing main db");
  await client.query(db);
  console.log("DB imported");
}

main().catch((error) => {
  console.log("Error", error);
});
