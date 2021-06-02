"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// TODO: Figure out how to connect to GCP in order to use this
// const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
// const client = new SecretManagerServiceClient();
// const getSecrets = async (keys) => {
//   const { GCP_SECRET_PROJECT } = process.env;
//   const secrets = keys.map(async (key) =>
//     client.accessSecretVersion({
//       name: `projects/${GCP_SECRET_PROJECT}/secrets/${key}/versions/latest`
//     })
//   );
//   const results = await Promise.all(secrets);
//   return keys.reduce(
//     (result, key, index) => ({
//       ...result,
//       [key]: results[index][0].payload.data.toString()
//     }),
//     {}
//   );
// };

const getFile = (file) =>
  fs.readFileSync(path.resolve(__dirname, `../src/data/${file}`), "utf8");

async function main() {
  const db = getFile("company.sql");
  const roles = getFile("roles.sql");
  const procedure = getFile("procedure.sql");
  const rls = getFile("rls.sql");

  const { PG_USER, PG_DATABASE, PG_HOST, PG_PORT, PG_PASSWORD } = process.env;

  // const credentials = await getSecrets([
  //   "COMPANIES_DB_PASSWORD",
  //   "COMPANIES_DB_HOST"
  // ]).catch((error) => {
  //   console.log("Error fetching credentials", error);
  // });

  console.log(`Connecting to ${PG_HOST}:${PG_PORT} as ${PG_USER}....`);
  const client = new Client({
    user: PG_USER,
    database: PG_DATABASE,
    port: parseInt(PG_PORT),
    host: PG_HOST,
    password: PG_PASSWORD,
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

  console.log("Importing roles");
  await client.query(roles);
  console.log("roles imported");

  console.log("Importing procedure");
  await client.query(procedure);
  console.log("procedure imported");

  console.log("Importing RLS");
  await client.query(rls);
  console.log("RLS imported");
}

main().catch((error) => {
  console.log("Error", error);
});
