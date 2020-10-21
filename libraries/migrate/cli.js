"use strict";

const { spawn } = require("child_process");
require("dotenv").config({
  path: `${__dirname}/.env.${process.env.NODE_ENV || "development"}`
});

const main = async ([command = "--help", ...options]) => {
  const {
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    CONTENTFUL_ENV_ID
  } = process.env;

  try {
    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_ACCESS_TOKEN)
      throw Error(
        "Missing env config `CONTENTFUL_SPACE_ID` or `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`"
      );

    spawn(
      "ctf-migrate",
      [command, "-s", CONTENTFUL_SPACE_ID, "-e", CONTENTFUL_ENV_ID, ...options],
      {
        stdio: "inherit",
        cwd: __dirname
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

main(process.argv.slice(2));
