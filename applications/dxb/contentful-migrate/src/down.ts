import { argv } from "process";
import { migrateDown } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const {
  CONTENTFUL_ENVIRONMENT,
  MANAGEMENT_ACCESS_TOKEN,
  MIGRATION_DRY_RUN,
  SPACE_ID
} = process.env;

const main = async (script?: string) => {
  if (!SPACE_ID || !CONTENTFUL_ENVIRONMENT || !MANAGEMENT_ACCESS_TOKEN) {
    throw Error(
      "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
    );
  }

  if (!script) {
    throw Error("Missing script to rollback to");
  }

  return await migrateDown(
    script,
    "scripts",
    __dirname,
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN,
    MIGRATION_DRY_RUN === "true"
  );
};

main(argv[2])
  .then((status) => process.exit(status || 0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
