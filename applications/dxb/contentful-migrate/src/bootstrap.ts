import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { bootstrap } from "@bmi-digital/contentful-migration";
import "dotenv/config";

const main = async () => {
  await bootstrap(
    process.env.SPACE_ID!,
    process.env.CONTENTFUL_ENVIRONMENT!,
    process.env.MANAGEMENT_ACCESS_TOKEN!,
    path.dirname(fileURLToPath(import.meta.url))
  );
};

// istanbul ignore if - can't override require.main
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
  });
}
