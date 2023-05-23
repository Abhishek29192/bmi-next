import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { argv } from "node:process";
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
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "..",
      "src"
    ),
    MIGRATION_DRY_RUN === "true"
  );
};

// istanbul ignore if - can't override require.main
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(argv[2])
    .then((status) => process.exit(status || 0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
