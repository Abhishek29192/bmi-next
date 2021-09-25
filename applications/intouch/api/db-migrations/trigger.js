"use strict";

require("dotenv").config();

const { GoogleAuth } = require("google-auth-library");

const url = `${process.env.MIGRATION_SERVICE_URL}/migrate`;

const auth = new GoogleAuth();

async function request() {
  const { URL } = require("url");
  const targetAudience = new URL(url);

  console.info(`request ${url} with target audience ${targetAudience}`);
  const client = await auth.getIdTokenClient(targetAudience);
  const res = await client.request({ url });
  console.info(res.data);
}

request(url).catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
