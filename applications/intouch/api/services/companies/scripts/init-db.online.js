"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { Client } = require("pg");

const {
  GCP_SECRET_PROJECT,
  PG_USER = "postgres",
  PG_DATABASE = "companies-db"
} = process.env;

const client = new SecretManagerServiceClient();

const getSecret = async (key) => {
  const secret = await client.accessSecretVersion({
    name: `projects/${GCP_SECRET_PROJECT}/secrets/${key}/versions/latest`
  });

  return secret[0].payload.data.toString();
};

const getFile = (file) =>
  fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`), "utf8");

async function main() {
  const db = getFile("company.sql");
  const roles = getFile("roles.sql");
  const procedure = getFile("procedure.sql");
  const rls = getFile("rls.sql");
  const views = getFile("views.sql");

  const PG_PASSWORD = await getSecret("COMPANIES_DB_PASSWORD");
  const PG_HOST = await getSecret("COMPANIES_DB_HOST");
  const PG_PORT = 5432;

  console.log(`Connecting to ${PG_HOST}:${PG_PORT}`);
  console.log(
    `Connecting as user:'${PG_USER}' to db:'${PG_DATABASE}' database using`
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

  console.log("Importing views");
  await client.query(views);
  console.log("Views imported");

  console.log("Importing roles");
  await client.query(roles);
  console.log("Roles imported");

  console.log("Importing procedure");
  await client.query(procedure);
  console.log("Procedure imported");

  console.log("Importing RLS");
  await client.query(rls);
  console.log("RLS imported");

  process.exit(0);
}

main().catch((error) => {
  console.log("Error", error);
  process.exit(1);
});
