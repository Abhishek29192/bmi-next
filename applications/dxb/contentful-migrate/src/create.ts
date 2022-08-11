import path from "path";
import { argv } from "process";
import { migrateCreate } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const { MIGRATION_DRY_RUN } = process.env;

export const main = async (script?: string) => {
  if (!script) {
    throw Error("Missing script name to create");
  }

  return await migrateCreate(
    script,
    "scripts",
    path.join(__dirname, "..", "src"),
    MIGRATION_DRY_RUN === "true"
  );
};

// istanbul ignore if - can't override require.main
if (require.main === module) {
  main(argv[2])
    .then((status) => process.exit(status || 0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
