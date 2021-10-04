"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const { PG_USER = "postgres", PG_COMPANY_DATABASE = "companies-db" } =
  process.env;

const getFile = (file) =>
  fs.readFileSync(
    path.resolve(__dirname, `../../../services/companies/src/data/${file}`),
    "utf8"
  );

const importCompanyDb = async ({ password, host }, query) => {
  const db = getFile("company.sql");
  const dbData = getFile("company.data.sql");
  const contraints = getFile("company.contraints.sql");
  const roles = getFile("roles.sql");
  const procedure = getFile("procedure.sql");
  const rls = getFile("rls.sql");
  const views = getFile("views.sql");

  const PG_PORT = 5432;

  console.log(`Connecting to ${host}:${PG_PORT}`);
  console.log(
    `Connecting as user:'${PG_USER}' to db:'${PG_COMPANY_DATABASE}' database using`
  );

  const pgClient = new Client({
    connectionTimeoutMillis: 30000,
    port: parseInt(PG_PORT),
    database: PG_COMPANY_DATABASE,
    user: PG_USER,
    password,
    host
  });
  await pgClient.connect();

  console.log("************ Importing company database ******************");

  console.log("Dropping the schema");
  await pgClient.query("DROP SCHEMA IF EXISTS public CASCADE");
  console.log("Dropped");
  console.log("Creating the schema");
  await pgClient.query("CREATE SCHEMA public");
  console.log("Created");

  console.log("Importing main db");
  await pgClient.query(db);
  console.log("DB imported");

  if (query.importData === "true") {
    console.log("Importing data");
    await pgClient.query(dbData);
    console.log("Data imported");
  }

  console.log("Importing contraints");
  await pgClient.query(contraints);
  console.log("Contraints imported");

  console.log("Importing views");
  await pgClient.query(views);
  console.log("Views imported");

  console.log("Importing roles");
  await pgClient.query(roles);
  console.log("Roles imported");

  console.log("Importing procedure");
  await pgClient.query(procedure);
  console.log("Procedure imported");

  console.log("Importing RLS");
  await pgClient.query(rls);
  console.log("RLS imported");

  console.log("************ Company database imported ******************");
};

module.exports = { importCompanyDb };
