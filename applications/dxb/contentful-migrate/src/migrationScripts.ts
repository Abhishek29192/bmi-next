import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrateUp } from "@bmi-digital/contentful-migration";

export const runMigrationScripts = async (
  spaceId: string,
  contentfulAlias: string,
  managementAccessToken: string
) => {
  console.log(
    `Running migration on contentful environment ${contentfulAlias}...`
  );

  await migrateUp(
    path.dirname(fileURLToPath(import.meta.url)),
    spaceId,
    contentfulAlias,
    managementAccessToken
  );

  console.log(
    `Finished running migration on contentful environment ${contentfulAlias}.`
  );
};
