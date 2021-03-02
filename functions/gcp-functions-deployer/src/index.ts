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
  FUNCTIONS_METADATA_FILE,
  FUNCTIONS_SOURCE_FOLDER
} = process.env;
const secretManagerClient = new SecretManagerServiceClient();
const bucket = storage.bucket(GCP_STORAGE_NAME);

async function triggerCloudBuild(request: string) {
  const secret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_SECRET}/versions/latest`
  });
  const secretText = secret[0].payload.data.toString();

  const apiKeySecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_API_KEY_SECRET}/versions/latest`
  });
  const apiKey = apiKeySecret[0].payload.data.toString();

  const url = `${GCP_CLOUD_BUILD_TRIGGER_URL}?secret=${secretText}&key=${apiKey}`;
  console.log(`Build base URL: ${GCP_CLOUD_BUILD_TRIGGER_URL}`);
  var response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" }
  });
  if (response.status != 200) {
    console.error(
      `Build trigger error: ${response.status} ${response.statusText}`
    );
  }
}

export const deploy: HandlerFunction = async (file, context) => {
  console.log(`Bucket: ${file.bucket}`);
  console.log(`File: ${file.name}`);

  if (!file.name.startsWith(`${FUNCTIONS_SOURCE_FOLDER}/`)) {
    console.warn("Invalid source folder received. Skipping the deployment.");
    return;
  }

  const metadataFile = await bucket.file(
    `${FUNCTIONS_METADATA_FOLDER}/${FUNCTIONS_METADATA_FILE}`
  );

  if (!metadataFile) {
    console.warn("Metadata file not found. Skipping the deployment.");
    return;
  }

  console.log(`file: ${metadataFile.name}`);
  try {
    var fileContent = await metadataFile.download();
    var metadata = await filterFunctionMetadata(fileContent, file.name);
    if (metadata) {
      await triggerCloudBuild(metadata);
    }
  } catch (error) {
    console.error(error);
  }
};
