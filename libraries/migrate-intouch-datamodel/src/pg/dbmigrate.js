#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { Pool } = require("pg");
require("dotenv").config();

const { PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_SCHEMA } = process.env;

let fullQuery = `CREATE SCHEMA IF NOT EXISTS ${PG_SCHEMA};
SET search_path = ${PG_SCHEMA};
`;
const updateDb = (query) => {
  const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  pool.query(query, (err, res) => {
    if (err) console.error("Pool:", err, res);
    pool.end();
  });
};

fs.readFile("data/sqlout.sql", "utf8", (err, data) => {
  if (err) {
    return console.error("Error reading sql script:", err);
  }
  fullQuery += data;
  updateDb(fullQuery);
});
