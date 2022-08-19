import path from "path";
import { argv } from "process";
import { migrateCreate } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const { MIGRATION_DRY_RUN } = process.env;

const main = async (script?: string, contentType?: string) => {
  if (!script) {
    throw Error("Missing script name to create");
  }

  if (!contentType) {
    throw Error("Missing content type for the script to rollback on");
  }

  return await migrateCreate(
    script,
    contentType,
    path.join(__dirname, "..", "src"),
    MIGRATION_DRY_RUN === "true"
  );
};

main(argv[2], argv[3])
  .then((status) => process.exit(status || 0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
