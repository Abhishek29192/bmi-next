#!/usr/bin/env node
"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readline = require("readline");
const contentful = require("contentful-management");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = async (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const readFile = promisify(fs.readFile);

const SEPARATOR = "\t";

const LOCALE = process.env.LOCALE;

const CONTENT_TYPE_ID = "roofer";

const TEMPLATE_NAME = "merchants";

const columns = [
  { label: "Company Name", name: "name", type: "string" },
  { label: "Latitude", name: "lat", type: "number" },
  { label: "Longitude", name: "lon", type: "number" },
  { label: "Address", name: "address", type: "string" },
  { label: "City", name: "city", type: "string" },
  { label: "Postcode", name: "postcode", type: "string" },
  { label: "PhoneNumber", name: "phone", type: "string" },
  { label: "Email", name: "email", type: "string" },
  { label: "Company Website", name: "website", type: "string" },
  { label: "Summary of Company", name: "summary", type: "string" }
];

const columnsString = columns.map(({ label }) => label).join(", ");

const parsers = {
  string: (v) => v,
  number: (v) => parseFloat(v)
};

const parseValue = (type, value) => parsers[type](value.trim());

const upload = async (file, environment) => {
  console.log(`Reading ${file}`);

  const data = await readFile(file, "utf8");

  // eslint-disable-next-line no-unused-vars
  const [emptyLine, headersLine, ...dataLines] = data.split("\n");

  if (emptyLine.trim() !== "") {
    throw new Error(`First line must be empty to match the template`);
  }

  const headerLineColumns = headersLine.split(SEPARATOR).map((c) => c.trim());

  if (
    headerLineColumns.length !== columns.length ||
    !headerLineColumns.every((label, index) => label === columns[index].label)
  ) {
    throw new Error(
      `Second line doesn't match header template` +
        "\n" +
        `Expected: ${columnsString}` +
        "\n" +
        `Found: ${headerLineColumns}`
    );
  }

  console.log(
    `Uploading ${dataLines.length} lines to columns: ${columnsString}`
  );

  for (const [index, dataLine] of dataLines.entries()) {
    if (!dataLine.trim()) {
      console.log(`Skipping empty line: ${index + 1}`);
      continue;
    }

    const record = dataLine.split(SEPARATOR).reduce((acc, value, i) => {
      const { name, type } = columns[i];
      acc[name] = parseValue(type, value);
      return acc;
    }, {});

    const fields = {
      entryType: "Merchant",
      name: record["name"],
      ...(typeof record["lat"] === "number" &&
      !isNaN(record["lat"]) &&
      typeof record["lon"] === "number" &&
      !isNaN(record["lon"])
        ? {
            location: {
              lat: record["lat"],
              lon: record["lon"]
            }
          }
        : {}),
      address:
        record["address"] +
        (record["city"] ? `, ${record["city"]}` : "") +
        (record["postcode"] ? `, ${record["postcode"]}` : ""),
      phone: record["phone"],
      email: record["email"],
      website: record["website"],
      summary: record["summary"]
    };

    const fieldsLocalised = Object.entries(fields).reduce(
      (acc, [key, value]) => {
        acc[key] = { [LOCALE]: value };
        return acc;
      },
      {}
    );

    try {
      await environment.createEntry(CONTENT_TYPE_ID, {
        fields: fieldsLocalised
      });
    } catch (error) {
      console.error(`Failed to upload line: ${index + 1}`, error);
    }
  }
};

const main = async (file) => {
  if (!file) {
    throw new Error("file path is missing");
  }

  console.log(`Looking in ${file}`);

  const fileContentTypeId = path.basename(file, path.extname(file));

  if (fileContentTypeId !== TEMPLATE_NAME) {
    throw new Error(
      `The file must be named the same as the template name:` +
        "\n" +
        `Expected: ${TEMPLATE_NAME} Found: ${fileContentTypeId}`
    );
  }

  if (
    ![
      process.env.MANAGEMENT_ACCESS_TOKEN,
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.LOCALE
    ].every(Boolean)
  ) {
    throw new Error("Missing Env vars");
  }

  const client = contentful.createClient({
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
  });

  const space = await client.getSpace(process.env.SPACE_ID);
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT
  );

  console.log(
    `Uploadng to ${CONTENT_TYPE_ID}, using:` +
      "\n" +
      `SPACE: ${process.env.SPACE_ID}` +
      "\n" +
      `ENVIRONMENT: ${process.env.CONTENTFUL_ENVIRONMENT}`
  );

  const shouldContinue = await ask("Continue (y/N)?");

  if (shouldContinue !== "y") {
    console.log("Exiting...");
    return;
  }

  await upload(file, environment);

  console.log("All done");
};

main(process.argv[2])
  .catch((error) => {
    console.error(error);
    console.error("Process failed");
  })
  .finally(() => rl.close());
