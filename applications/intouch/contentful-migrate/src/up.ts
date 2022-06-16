import path from "path";
import { migrateUp } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const {
  CONTENTFUL_ENVIRONMENT,
  MANAGEMENT_ACCESS_TOKEN,
  MIGRATION_DRY_RUN,
  SPACE_ID
} = process.env;

const main = async () => {
  if (!SPACE_ID || !CONTENTFUL_ENVIRONMENT || !MANAGEMENT_ACCESS_TOKEN) {
    throw Error(
      "Missing env config `SPACE_ID` or `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN`"
    );
  }

  return await migrateUp(
    path.join(path.resolve(), "dist"),
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN,
    MIGRATION_DRY_RUN === "true"
  );
};

main()
  .then((status) => process.exit(status || 0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
