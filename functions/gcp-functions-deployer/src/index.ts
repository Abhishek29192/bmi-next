import fetch from "node-fetch";
import type { HandlerFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Storage } from "@google-cloud/storage/build/src/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { filterFunctionMetadata } from "./filter";

const storage = new Storage();
const {
  GCP_STORAGE_NAME,
  SECRET_MAN_GCP_PROJECT_NAME,
  TRIGGER_SECRET,
  TRIGGER_API_KEY_SECRET,
  FUNCTIONS_METADATA_FOLDER,
  FUNCTIONS_METADATA_FILE,
  FUNCTIONS_SOURCE_FOLDER,
  GCP_PROJECT_NAME
} = process.env;
const secretManagerClient = new SecretManagerServiceClient();
const bucket = storage.bucket(GCP_STORAGE_NAME);
const triggerNameRegex = "sources/(.*).zip";

async function triggerCloudBuild(request: string, source: string) {
  const secret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_SECRET}/versions/latest`
  });
  const secretText = secret[0].payload.data.toString();

  const apiKeySecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_API_KEY_SECRET}/versions/latest`
  });
  const apiKey = apiKeySecret[0].payload.data.toString();

  const match = source.match(triggerNameRegex);
  if (!match) {
    throw "trigger not found";
  }

  const triggerName = `${match[1]}-trigger`;
  const url = `https://cloudbuild.googleapis.com/v1/projects/${GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiKey}&secret=${secretText}`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" }
  });
  if (response.status != 200) {
    // eslint-disable-next-line no-console
    console.error(
      `Build trigger error: ${response.status} ${response.statusText}`
    );
  }
}

export const deploy: HandlerFunction = async (file, context) => {
  // eslint-disable-next-line no-console
  console.log(`Bucket: ${file.bucket}`);
  // eslint-disable-next-line no-console
  console.log(`File: ${file.name}`);

  if (!file.name.startsWith(`${FUNCTIONS_SOURCE_FOLDER}/`)) {
    // eslint-disable-next-line no-console
    console.warn("Invalid source folder received. Skipping the deployment.");
    return;
  }

  const metadataFile = await bucket.file(
    `${FUNCTIONS_METADATA_FOLDER}/${FUNCTIONS_METADATA_FILE}`
  );

  if (!metadataFile) {
    // eslint-disable-next-line no-console
    console.warn("Metadata file not found. Skipping the deployment.");
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`file: ${metadataFile.name}`);
  try {
    const fileContent = await metadataFile.download();
    const metadata = await filterFunctionMetadata(fileContent, file.name);
    if (metadata) {
      await triggerCloudBuild(metadata, file.name);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Metadata file not found for ${file.name} source`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
