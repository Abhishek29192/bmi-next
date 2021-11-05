"use strict";

require("dotenv").config();
var DBMigrate = require("db-migrate");

const { PG_USER, PG_PORT, PG_HOST } = process.env;

const migrate = async (req) => {
  const { query } = req;

  const dbmigrate = DBMigrate.getInstance(true, {
    throwUncatched: true,
    config: {
      dev: {
        driver: "pg",
        user: PG_USER,
        password: "postgres",
        host: PG_HOST,
        database: "companies-db",
        port: PG_PORT,
        schema: "public"
      }
    }
  });

  let migrations = parseInt(query.migrations);

  if (isNaN(migrations)) {
    migrations = 1;
  }

  if (query.direction === "up") {
    return await dbmigrate.up();
  } else {
    return await dbmigrate.down();
  }
};

module.exports = { migrate };
