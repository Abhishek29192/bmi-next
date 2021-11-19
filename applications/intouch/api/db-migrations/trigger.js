"use strict";

require("dotenv").config();

const { GoogleAuth } = require("google-auth-library");

const auth = new GoogleAuth();

async function request(url) {
  const { URL } = require("url");
  const targetAudience = new URL(url);

  console.info(`request ${url} with target audience ${targetAudience}`);
  const client = await auth.getIdTokenClient(targetAudience);
  const res = await client.request({ url });
  console.info(res.data);
}

function main() {
  const [dbname, direction] = process.argv.slice(2);

  if (!dbname || !direction) {
    if (!dbname) {
      console.error(
        "Missing service to update, please pass companies or training"
      );
    }
    if (!direction) {
      console.error("Missing direction of the migration plase use up or down");
    }
    console.log("node trigger.js company or node trigger.js training");
    process.exitCode = 1;
    return;
  }

  request(
    `${process.env.MIGRATION_SERVICE_URL}/migrate-${dbname}?import=true&direction=${direction}`
  ).catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}

main();
