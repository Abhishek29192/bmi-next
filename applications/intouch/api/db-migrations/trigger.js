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
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "Missing service to update, please pass companies or training"
    );
    console.log("node trigger.js company or node trigger.js training");
    process.exitCode = 1;
    return;
  }

  // request(
  //   `${process.env.MIGRATION_SERVICE_URL}/migrate-${args[0]}?importData=true`
  // ).catch((err) => {
  //   console.error(err.message);
  //   process.exitCode = 1;
  // });
}

main();
