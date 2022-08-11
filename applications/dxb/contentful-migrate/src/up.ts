import "dotenv/config";
import { runMigrationScripts } from "./migrationScripts";

const {
  CONTENTFUL_ENVIRONMENT,
  MANAGEMENT_ACCESS_TOKEN,
  MIGRATION_DRY_RUN,
  SPACE_ID
} = process.env;

export const main = async () => {
  if (!SPACE_ID || !CONTENTFUL_ENVIRONMENT || !MANAGEMENT_ACCESS_TOKEN) {
    throw Error(
      "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
    );
  }

  await runMigrationScripts(
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN,
    MIGRATION_DRY_RUN === "true"
  );
};

// istanbul ignore if - can't override require.main
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
  });
}
