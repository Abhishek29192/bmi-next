#!/usr/bin/env node
import {
  createTag,
  publishAll,
  tagAndUpdate
} from "@bmi/cms-consolidation-utility";
import { waitFor } from "@bmi/utils";
import { createClient } from "contentful-management";
import { config } from "dotenv";

/* istanbul ignore next */
config({
  path: `${__dirname}/.env.${process.env.NODE_ENV || "development"}`
});

export async function main() {
  const client = createClient({
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
  });

  const space = await client.getSpace(process.env.SPACE_ID!);
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT!
  );

  await createTag(environment, process.env.DXB_MARKET!);

  console.log("Sleeping for 5000 milliseconds");
  await waitFor(5000);

  await tagAndUpdate(environment);
  await publishAll(environment);
}

main();
