#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { Pool } = require("pg");
const config = require("../../config.json");
require("dotenv").config();

const { PG_SCHEMA } = process.env;

let fullQuery = `CREATE SCHEMA IF NOT EXISTS ${PG_SCHEMA};
SET search_path = ${PG_SCHEMA};
`;
const updateDb = ({ poolConfig, data }) => {
  const newQuery = fullQuery + data;

  const config = {
    ...poolConfig,
    ssl: { rejectUnauthorized: false }
  };
  const pool = new Pool(config);
  pool.query(newQuery, (err, res) => {
    if (err) console.error("Pool:", err, res);
    pool.end();
  });
};
Object.entries(config).forEach(([key, value]) => {
  fs.readFile(`data/${key}.sql`, "utf8", (err, data) => {
    if (err) {
      return console.error("Error reading sql script:", err);
    }
    updateDb({
      poolConfig: value,
      data: data
    });
  });
});
