import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrateUp } from "@bmi-digital/contentful-migration";

export const runMigrationScripts = async (
  spaceId: string,
  contentfulAlias: string,
  managementAccessToken: string,
  isDryRun: boolean
) => {
  console.log(
    `Running migration on contentful environment ${contentfulAlias}...`
  );

  const status = await migrateUp(
    path.dirname(fileURLToPath(import.meta.url)),
    spaceId,
    contentfulAlias,
    managementAccessToken,
    isDryRun
  );

  if (status !== 0) {
    throw new Error(
      `Migration failed on contentful environment ${contentfulAlias}, please check the error log above.`
    );
  }
  console.log(
    `Finished running migration on contentful environment ${contentfulAlias}.`
  );
};
