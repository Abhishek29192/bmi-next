#!/usr/bin/env node
import { config } from "dotenv";
import { createClient } from "contentful-management";
import {
  createTag,
  tagAndUpdate,
  publishAll
} from "@bmi/contentful-tag-utility";

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
  await tagAndUpdate(environment);
  await publishAll(environment);
}

main();
