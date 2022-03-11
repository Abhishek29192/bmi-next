#!/usr/bin/env node
"use strict";

require("dotenv").config();
const fs = require("fs");
const { promisify } = require("util");
const readline = require("readline");
const fetch = require("node-fetch");
const contentful = require("contentful-management");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = async (question) =>
  new Promise((resolve) => rl.question(question, resolve));

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);

let LOCALE = process.env.LOCALE;
const SEPARATOR = "\t";
const CONTENT_TYPE_ID = "roofer";
const SERVICE_TYPE_CONTENT_TYPE_ID = "serviceType";
let serviceTypeOwnKeyValueMap = {}; //this will be updated

const columns = [
  { label: "Name", name: "name", type: "string" },
  { label: "Latitude", name: "lat", type: "number" },
  { label: "Longitude", name: "lon", type: "number" },
  { label: "Type of Merchant", name: "merchantType", type: "string" },
  { label: "Address", name: "address", type: "string" },
  { label: "Country", name: "country", type: "string" },
  { label: "City", name: "city", type: "string" },
  { label: "Postcode", name: "postcode", type: "string" },
  { label: "PhoneNumber", name: "phone", type: "string" },
  { label: "Email", name: "email", type: "string" },
  { label: "Website", name: "website", type: "string" },
  { label: "Summary of Company", name: "summary", type: "string" }
];

const columnsString = columns.map(({ label }) => label).join(", ");

const parsers = {
  string: (v) => v,
  number: (v) => parseFloat(v.replace(",", ".").replace('"', ""))
};

// eslint-disable-next-line security/detect-object-injection
const parseValue = (type, value) => parsers[type](value.trim());

const getExstingServiceTypes = async (environment) => {
  const allServiceTypeEntries = await environment.getEntries({
    content_type: SERVICE_TYPE_CONTENT_TYPE_ID
  });
  if (allServiceTypeEntries && allServiceTypeEntries.total > 0) {
    // Populate the dictionary from values found from contentful
    return allServiceTypeEntries.items.reduce(
      (allEntries, serviceTypeEntry) => {
        return {
          ...allEntries,
          // eslint-disable-next-line security/detect-object-injection
          [serviceTypeEntry.fields.name[LOCALE]]: serviceTypeEntry.sys.id
        };
      },
      {}
    );
  }
  return {};
};

const uploadLines = async (lines, environment) => {
  const successLoggerStream = fs.createWriteStream("log-success.txt", {
    flags: "a"
  });
  const errorLoggerStream = fs.createWriteStream("log-error.txt", {
    flags: "a"
  });
  const writeLine = (writeStream, message) => {
    writeStream.write("\n");
    writeStream.write(`${new Date().toISOString()} - ${message}`);
  };
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
        // eslint-disable-next-line security/detect-object-injection
        const { name, type } = columns[i];
        // eslint-disable-next-line security/detect-object-injection
        acc[name] = parseValue(type, value);
        return acc;
      }, {});

    console.log(`Uploading line ${lineNumber}: '${record["name"]}'`);

    const address =
      record["address"] +
      (record["city"] ? `, ${record["city"]}` : "") +
      `, ${record["postcode"]}`;

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
        const geoCodeErr = `'${record["name"]}' : Address "${address}" couldn't be geocoded. Error: ${error_message}.`;
        console.error(geoCodeErr);
        writeLine(errorLoggerStream, geoCodeErr);
      }
    }

    //check if serviceTypeDictionary has the entry for merchant type to link id from contentful
    const serviceTypeLinkId = serviceTypeOwnKeyValueMap[record["merchantType"]];
    let serviceTypeEntryId = serviceTypeLinkId;
    if (!serviceTypeLinkId) {
      try {
        //get Service type link record id of this merchant
        const serviceTypeEntry = await environment.createEntry(
          SERVICE_TYPE_CONTENT_TYPE_ID,
          {
            fields: {
              name: { [LOCALE]: record["merchantType"] }
            }
          }
        );
        await serviceTypeEntry.publish();

        serviceTypeOwnKeyValueMap[record["merchantType"]] =
          serviceTypeEntry.sys.id;

        serviceTypeEntryId = serviceTypeEntry.sys.id;

        const serviceTypeCreatedMsg = `Created and Published new Service Type - '${
          record["merchantType"]
        }' with id '${serviceTypeOwnKeyValueMap[record["merchantType"]]}'`;

        console.log(serviceTypeCreatedMsg);
        writeLine(successLoggerStream, serviceTypeCreatedMsg);
      } catch (error) {
        const errMsg = `Failed to publish Merchant type : '${record["merchantType"]}' :: source line No.: ${lineNumber}`;
        console.error(errMsg, error);

        writeLine(errorLoggerStream, errMsg);
        writeLine(errorLoggerStream, JSON.stringify(error, null, 4));
      }
    }

    const fields = {
      entryType: "Merchant",
      name: record["name"],
      location,
      address,
      phone: record["phone"],
      email: record["email"],
      website: record["website"]
        ? record["website"].indexOf("//") > -1
          ? record["website"]
          : "https://" + record["website"]
        : undefined,
      summary: record["summary"],
      serviceTypes: [
        {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: serviceTypeEntryId
          }
        }
      ]
    };

    const fieldsLocalised = Object.entries(fields).reduce(
      (acc, [key, value]) => {
        // eslint-disable-next-line security/detect-object-injection
        acc[key] = { [LOCALE]: value };
        return acc;
      },
      {}
    );

    let serviceEntryPayload = {
      fields: fieldsLocalised
    };

    try {
      const newEntry = await environment.createEntry(CONTENT_TYPE_ID, {
        ...serviceEntryPayload
      });

      const publishResult = await newEntry.publish();

      if (publishResult && publishResult.sys && publishResult.sys.version > 0) {
        const message = `'${record["name"]}' : was created and published with id: ${publishResult.sys.id}`;
        writeLine(successLoggerStream, message);
      }
    } catch (error) {
      const errMsg = `Failed to publish '${record["name"]}' :: source line No.: ${lineNumber}`;
      console.error(errMsg, error);

      writeLine(errorLoggerStream, errMsg);
      writeLine(errorLoggerStream, JSON.stringify(error, null, 4));
    }
  }
  errorLoggerStream.end();
  successLoggerStream.end();
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
    // eslint-disable-next-line security/detect-object-injection
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

  const allLocales = await environment.getLocales();

  // .env locale can be different from the environment's locale
  // we can get envornment's locale and update variable..we do not need environment variable
  // but keeping it for fallback purpose!
  if (allLocales && allLocales.total > 0) {
    const environmentLocale = allLocales.items[0].code;
    if (environmentLocale !== LOCALE) {
      LOCALE = environmentLocale;
      console.log(`updated LOCALE environment Locale : ${LOCALE}`);
    }
  }

  // Get master list of service type entries
  serviceTypeOwnKeyValueMap = await getExstingServiceTypes(environment);

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
