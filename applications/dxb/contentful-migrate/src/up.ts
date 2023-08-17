import { pathToFileURL } from "node:url";
import "dotenv/config";
import { runMigrationScripts } from "./migrationScripts.js";

const { CONTENTFUL_ENVIRONMENT, MANAGEMENT_ACCESS_TOKEN, SPACE_ID } =
  process.env;

export const main = async () => {
  if (!SPACE_ID || !CONTENTFUL_ENVIRONMENT || !MANAGEMENT_ACCESS_TOKEN) {
    throw Error(
      "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
    );
  }

  await runMigrationScripts(
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN
  );
};

// istanbul ignore if - can't override require.main
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
  });
}
