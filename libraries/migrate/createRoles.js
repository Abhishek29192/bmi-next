#!/usr/bin/env node
"use strict";

const { readFileSync } = require("fs");
const { join } = require("path");
const contentful = require("contentful-management");
require("./env");

const {
  MANAGEMENT_ACCESS_TOKEN,
  PROJECT_RELATIVE_PATH,
  SPACE_ID
} = process.env;

const client = contentful.createClient({
  accessToken: MANAGEMENT_ACCESS_TOKEN
});

const roles = JSON.parse(
  readFileSync(join(__dirname, PROJECT_RELATIVE_PATH, "roles.json"), "utf-8")
);

client.getSpace(SPACE_ID).then((space) =>
  Promise.all(roles.map((role) => space.createRole(role)))
    .then((roles) => {
      console.log("created the following roles", roles);
    })
    .catch((error) => {
      console.error(error);
    })
);
