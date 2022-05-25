#!/usr/bin/env node
import { fillDefaultValues } from "@bmi/contentful-tag-utility";
import { createClient } from "contentful-management";
import { config } from "dotenv";

/* istanbul ignore next */
config({
  path: `${__dirname}/.env.${process.env.NODE_ENV || "development"}`
});

export async function main(locales: string[]): Promise<void> {
  if (!locales || locales.length <= 0) {
    console.error(
      "Market locales are not provided. Please input space seperated list of locales"
    );
    return;
  }
  console.log(`locales ${locales}`);
  const client = createClient({
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
  });

  const space = await client.getSpace(process.env.SPACE_ID!);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT!
  );

  await fillDefaultValues(environment, locales);
}

main(process.argv.slice(2));
