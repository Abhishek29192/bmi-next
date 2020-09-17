#!/usr/bin/env node

"use strict";

const { runMigration } = require("contentful-migration");
require("dotenv").config({
  path: `${__dirname}/.env.${process.env.NODE_ENV || "development"}`
});

const main = async (argv) => {
  const { SPACE_ID, ACCESS_TOKEN } = process.env;
  const environmentId = argv.find((arg) => arg !== "-d");

  try {
    if (!SPACE_ID || !ACCESS_TOKEN)
      throw Error("Missing env config `SPACE_ID` or `ACCESS_TOKEN`");

    await runMigration({
      filePath: `${__dirname}/src/index.js`,
      spaceId: SPACE_ID,
      accessToken: ACCESS_TOKEN,
      environmentId
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

main(process.argv.slice(2));
