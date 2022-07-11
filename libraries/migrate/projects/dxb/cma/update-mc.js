"use strict";

/* 
  This script compares Micro Copies @bmi/head <---> Contentful. In case
  new Micro Copies are found - creates new for every local that is used
  in a specific environment. By default, creates draft Micro Copies with 
  an empty value
  
  Can use option --publish. Provide this option to publish all just created 
  Micro Copies. In this case, the value of each will be the same as the value 
*/

require("ts-node").register();
require("../../../env");

const contentful = require("contentful-management");
const microCopies = require("@bmi/head/src/constants/microCopies.ts");

/*
  Contentful Management API have limitation to amount of requests
  For more info https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/api-rate-limits
*/
const CHUNK_SIZE = 10;
const TIMEOUT = 1500;

/*
  Contentful Management API have limitation to size of bulk operations
  For more info https://www.contentful.com/developers/docs/references/content-management-api/#/reference/bulk-actions
*/
const BULK_SIZE = 200;

const KEYS_REQUEST_PAGE_SIZE = 100;

const TO_BE_PUBLISHED = process.argv.includes("--publish");

let environmentCache;

const getEnvironment = async () => {
  if (environmentCache) {
    return environmentCache;
  }

  const client = contentful.createClient({
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
  });
  const space = await client.getSpace(process.env.SPACE_ID);

  environmentCache = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT
  );

  return environmentCache;
};

const getContentfulKeys = async (fetched = [], total) => {
  if (fetched.length === total) {
    return fetched;
  }

  const environment = await getEnvironment();

  const resources = await environment.getEntries({
    content_type: "resource",
    skip: fetched.length,
    limit: KEYS_REQUEST_PAGE_SIZE
  });

  const keys = resources.items.map(
    (resource) => Object.values(resource.fields.key)[0]
  );

  const result = [...fetched, ...keys];

  return getContentfulKeys(result, resources.total);
};

const waitFor = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

const uploadChunk = async (chunk, locales, i) => {
  const environment = await getEnvironment();

  // Create a queue of chunk uploads to fix requests limitation
  await waitFor(TIMEOUT * (i + 1));

  const chunkPromises = chunk.map((key) => {
    const keyForLocales = Object.fromEntries(
      locales.map((locale) => [locale, key])
    );

    const fields = TO_BE_PUBLISHED
      ? {
          key: keyForLocales,
          value: keyForLocales
        }
      : {
          key: keyForLocales
        };

    return environment.createEntry("resource", { fields });
  });
  const results = await Promise.allSettled(chunkPromises);
  const fulfilled = results.filter(({ status }) => status === "fulfilled");

  console.log(`${fulfilled.length} successfully uploaded`);

  return fulfilled.map(({ value }) => ({
    sys: {
      linkType: "Entry",
      type: "Link",
      id: value.sys.id,
      version: value.sys.version
    }
  }));
};

const uploadMicroCopiesChunks = async (chunks) => {
  const environment = await getEnvironment();

  const locales = (await environment.getLocales()).items.map(
    (locale) => locale.code
  );
  const promises = chunks.map((chunk, i) => uploadChunk(chunk, locales, i));

  const newNodes = await Promise.all(promises);

  await waitFor(TIMEOUT);

  return newNodes.flat();
};

const publishMicroCopies = async (nodes) => {
  if (nodes.length === 0) {
    console.log("Publish action is complete");
    return;
  }

  const entriesToPublish = nodes.slice(0, BULK_SIZE);

  const environment = await getEnvironment();

  const bulk = await environment.createPublishBulkAction({
    entities: {
      sys: { type: "Array" },
      items: entriesToPublish
    }
  });

  await bulk.waitProcessing();

  console.log(`${entriesToPublish.length} successfully published`);

  await publishMicroCopies(nodes.slice(BULK_SIZE));
};

const main = async () => {
  const projectKeys = Object.values(microCopies.microCopy);

  const contentfulKeys = await getContentfulKeys();

  const newKeys = projectKeys.filter((key) => !contentfulKeys.includes(key));

  if (newKeys.length === 0) {
    console.log("No new Micro Copies found");
    return;
  }

  const chunks = [];

  for (let i = 0; i < newKeys.length; i += CHUNK_SIZE) {
    chunks.push(newKeys.slice(i, i + CHUNK_SIZE));
  }

  console.log(
    `${newKeys.length} new Micro Copies found. Upload in ${chunks.length} chunks...`
  );

  const newNodes = await uploadMicroCopiesChunks(chunks);

  if (TO_BE_PUBLISHED) {
    console.log(`Publishing ${newNodes.length} entries`);
    await publishMicroCopies(newNodes);
  }

  console.log("Done");
};

main();
