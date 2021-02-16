import fetch from "node-fetch";
import type { HandlerFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Storage } from "@google-cloud/storage/build/src/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { filterFunctionMetadata } from "./filter";

const storage = new Storage();
const {
  GCP_STORAGE_NAME,
  GCP_CLOUD_BUILD_TRIGGER_URL,
  SECRET_MAN_GCP_PROJECT_NAME,
  TRIGGER_SECRET,
  TRIGGER_API_KEY_SECRET,
  FUNCTIONS_METADATA_FOLDER,
  FUNCTIONS_SOURCE_FOLDER
} = process.env;
const secretManagerClient = new SecretManagerServiceClient();

async function triggerCloudBuild(request: string) {
  console.log(`Request: ${request}`);

  const secret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_SECRET}/versions/latest`
  });
  const secretText = secret[0].payload.data.toString();

  const apiKeySecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_API_KEY_SECRET}/versions/latest`
  });
  const apiKey = apiKeySecret[0].payload.data.toString();

  const url = `${GCP_CLOUD_BUILD_TRIGGER_URL}?secret=${secretText}&key=${apiKey}`;
  console.log(`Build URL: ${url}`);
  console.log(`Body: ${JSON.stringify(request)}`);
  var response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" }
  });
  // TODO: find a way to fetch async without overflowing cloud function execution time
}

export const deploy: HandlerFunction = async (file, context) => {
  console.log(`  Event: ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);

  if (!file.name.startsWith(`${FUNCTIONS_SOURCE_FOLDER}/`)) {
    console.warn("Invalid source folder received. Skipping the deployment.");
    return;
  }

  console.log(GCP_STORAGE_NAME);
  const [files] = await storage
    .bucket(GCP_STORAGE_NAME)
    .getFiles({ prefix: FUNCTIONS_METADATA_FOLDER });

  if (files.length <= 0) {
    console.warn("Metadata files not found. Skipping the deployment.");
    return;
  }

  for (const f of files) {
    try {
      console.log(`file: ${f.name}`);
      if (f.name !== FUNCTIONS_METADATA_FOLDER + "/") {
        var fileContent = await f.download();
        var metadata = await filterFunctionMetadata(fileContent, file.name);
        if (metadata) {
          await triggerCloudBuild(metadata);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};
