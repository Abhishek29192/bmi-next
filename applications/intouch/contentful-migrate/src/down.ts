import { argv } from "process";
import { migrateDown } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const {
  CONTENTFUL_ENVIRONMENT,
  MANAGEMENT_ACCESS_TOKEN,
  MIGRATION_DRY_RUN,
  SPACE_ID
} = process.env;

const main = async (script?: string, contentType?: string) => {
  if (!SPACE_ID || !CONTENTFUL_ENVIRONMENT || !MANAGEMENT_ACCESS_TOKEN) {
    throw Error(
      "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
    );
  }

  if (!script) {
    throw Error("Missing script to rollback to");
  }

  if (!contentType) {
    throw Error("Missing content type for the script to rollback on");
  }

  return await migrateDown(
    script,
    contentType,
    __dirname,
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN,
    MIGRATION_DRY_RUN === "true"
  );
};

main(argv[2], argv[3])
  .then((status) => process.exit(status || 0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
