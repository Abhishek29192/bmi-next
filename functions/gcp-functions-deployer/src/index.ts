import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage/build/src/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { filterFunctionMetadata } from "./filter";
import { FunctionMetadata } from "./types";

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
const bucket = GCP_STORAGE_NAME && storage.bucket(GCP_STORAGE_NAME);
const triggerNameRegex = `${FUNCTIONS_SOURCE_FOLDER}/(.*).zip`;

async function triggerCloudBuild(requests: FunctionMetadata[], source: string) {
  const secret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_SECRET}/versions/latest`
  });

  if (!secret[0].payload?.data) {
    throw Error("Unable to get trigger secret");
  }

  const secretText = secret[0].payload.data.toString();

  const apiKeySecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${TRIGGER_API_KEY_SECRET}/versions/latest`
  });

  if (!apiKeySecret[0].payload?.data) {
    throw Error("Unable to get trigger API key");
  }

  const apiKey = apiKeySecret[0].payload.data.toString();

  const triggerName = `${source}-trigger`;
  const url = `https://cloudbuild.googleapis.com/v1/projects/${GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${apiKey}&secret=${secretText}`;

  for (const key in requests) {
    const response = await fetch(url, {
      method: "POST",
      // eslint-disable-next-line security/detect-object-injection
      body: JSON.stringify(requests[key]),
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(
        `Build trigger error: ${response.status} ${response.statusText}`
      );
    }
  }
}

export const deploy = async (file: { bucket: string; name: string }) => {
  if (!bucket) {
    throw Error("Unable to connect to a storage bucket");
  }

  // eslint-disable-next-line no-console
  console.log(`Bucket: ${file.bucket}`);
  // eslint-disable-next-line no-console
  console.log(`File: ${file.name}`);

  const match = file.name.match(triggerNameRegex);
  if (!match) {
    // eslint-disable-next-line no-console
    console.warn("Invalid source folder recieved. Skipping the deployment.");
    return;
  }

  const metadataFile = bucket.file(
    `${FUNCTIONS_METADATA_FOLDER}/${FUNCTIONS_METADATA_FILE}`
  );

  if (!(await metadataFile.exists())) {
    // eslint-disable-next-line no-console
    console.warn("Metadata file not found. Skipping the deployment.");
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`file: ${metadataFile.name}`);
  try {
    const fileContent = await metadataFile.download();
    const metadata = filterFunctionMetadata(fileContent, file.name);
    if (metadata) {
      await triggerCloudBuild(metadata, match[1]);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Metadata file not found for ${file.name} source`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
