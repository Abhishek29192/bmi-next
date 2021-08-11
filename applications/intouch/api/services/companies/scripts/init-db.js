"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const getFile = (file) =>
  fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`), "utf8");

async function main() {
  const db = getFile("company.sql");
  const roles = getFile("roles.sql");
  const procedure = getFile("procedure.sql");
  const rls = getFile("rls.sql");

  const { PG_USER, PG_DATABASE, PG_HOST, PG_PORT, PG_PASSWORD } = process.env;

  console.log(
    `Connecting to '${PG_HOST}:${PG_PORT}' host:port as '${PG_USER}' user to '${PG_DATABASE}' database using '************' password...`
  );

  const client = new Client({
    user: PG_USER,
    database: PG_DATABASE,
    port: parseInt(PG_PORT),
    host: PG_HOST,
    password: PG_PASSWORD,
    connectionTimeoutMillis: 30000
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

  console.log("Importing roles");
  await client.query(roles);
  console.log("roles imported");

  console.log("Importing procedure");
  await client.query(procedure);
  console.log("procedure imported");

  console.log("Importing RLS");
  await client.query(rls);
  console.log("RLS imported");

  process.exit(0);
}

main().catch((error) => {
  console.log("Error", error);
  process.exit(1);
});
