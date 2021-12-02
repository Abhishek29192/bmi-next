#!/usr/bin/env node
"use strict";

require("dotenv").config();
const fs = require("fs");
const { promisify } = require("util");
const readline = require("readline");
const { capitalize } = require("lodash");
const fetch = require("node-fetch");
const contentful = require("contentful-management");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = async (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const readFile = promisify(fs.readFile);

const LOCALE = process.env.LOCALE;
const SEPARATOR = "\t";
const CONTENT_TYPE_ID = "roofer";

const columns = [
  { label: "Company Name", name: "name", type: "string" },
  { label: "Latitude", name: "lat", type: "number" },
  { label: "Longitude", name: "lon", type: "number" },
  { label: "Type of Merchant", name: "merchantType", type: "string" },
  { label: "Address", name: "address", type: "string" },
  { label: "City", name: "city", type: "string" },
  { label: "Postcode", name: "postcode", type: "string" },
  { label: "PhoneNumber", name: "phone", type: "string" },
  { label: "Email", name: "email", type: "string" },
  { label: "Website", name: "website", type: "string" },
  { label: "Summary of Company", name: "summary", type: "string" }
];

const toTitleCase = (str) => str.replace(/\w+/g, capitalize);

const columnsString = columns.map(({ label }) => label).join(", ");

const parsers = {
  string: (v) => v,
  number: (v) => parseFloat(v.replace(",", ".").replace('"', ""))
};

const parseValue = (type, value) => parsers[type](value.trim());

const uploadLines = async (lines, environment) => {
  for (const [index, dataLine] of lines) {
    const lineNumber = index + 1;
    if (!dataLine.trim()) {
      console.log(`Skipping empty line: ${lineNumber}`);
      continue;
    }

    const record = dataLine
      .trim()
      .split(SEPARATOR)
      .reduce((acc, value, i) => {
        const { name, type } = columns[i];
        acc[name] = parseValue(type, value);
        return acc;
      }, {});

    console.log(`Uploading line ${lineNumber}: ${record["name"]}`);

    const address =
      toTitleCase(
        record["address"] + (record["city"] ? `, ${record["city"]}` : "")
      ) + (record["postcode"] ? `, ${record["postcode"]}` : "");

    let location =
      typeof record["lat"] === "number" &&
      !isNaN(record["lat"]) &&
      typeof record["lon"] === "number" &&
      !isNaN(record["lon"])
        ? {
            lat: record["lat"],
            lon: record["lon"]
          }
        : undefined;

    if (!location && address) {
      const response = await fetch(
        encodeURI(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${record["name"]}${address}&key=${process.env.GOOGLE_GEOCODE_API_KEY}`
        )
      );
      const { results, error_message } = await response.json();
      if (results.length) {
        const geocodedLocation = results[0]["geometry"]["location"];
        location = {
          lat: geocodedLocation["lat"],
          lon: geocodedLocation["lng"]
        };
      } else {
        console.error(
          `Address "${address}" couldn't be geocoded. Error: ${error_message}.`
        );
      }
    }

    const fields = {
      entryType: "Merchant",
      name: toTitleCase(record["name"]),
      location,
      merchantType: [record["merchantType"]],
      address,
      phone: record["phone"],
      email: record["email"],
      website: record["website"]
        ? record["website"].indexOf("//") > -1
          ? record["website"]
          : "https://" + record["website"]
        : undefined,
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
      const newEntry = await environment.createEntry(CONTENT_TYPE_ID, {
        fields: fieldsLocalised
      });
      await newEntry.publish();
    } catch (error) {
      console.error(`Failed to upload line: ${lineNumber}`, error);
    }
  }
};

const uploadFile = async (file, environment) => {
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
        `Found:    ${headerLineColumns.join(", ")}`
    );
  }

  console.log(
    `Uploading ${dataLines.length} lines to columns: ${columnsString}`
  );

  await uploadLines(dataLines.entries(), environment);
};

const main = async (file) => {
  if (!file) {
    throw new Error("file path is missing");
  }

  console.log(`Looking in ${file}`);

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

  await uploadFile(file, environment);

  console.log("All done");
};

main(process.argv[2])
  .catch((error) => {
    console.error(error);
    console.error("Process failed");
  })
  .finally(() => rl.close());
