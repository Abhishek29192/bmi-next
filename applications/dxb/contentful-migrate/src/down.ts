import path from "node:path";
import { argv } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { migrateDown } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const { CONTENTFUL_ENVIRONMENT, MANAGEMENT_ACCESS_TOKEN, SPACE_ID } =
  process.env;

export const main = async (script?: string) => {
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
    path.dirname(fileURLToPath(import.meta.url)),
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN
  );
};

// istanbul ignore if - can't override require.main
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(argv[2]).catch((error) => {
    console.error(error);
  });
}
