import logger from "@bmi-digital/functions-logger";
import { getSecret } from "@bmi-digital/functions-secret-client";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage/build/src/storage";
import { filterFunctionMetadata } from "./filter";
import { FunctionMetadata } from "./types";

const storage = new Storage();
const {
  GCP_STORAGE_NAME,
  TRIGGER_SECRET,
  TRIGGER_API_KEY_SECRET,
  FUNCTIONS_METADATA_FOLDER,
  FUNCTIONS_METADATA_FILE,
  FUNCTIONS_SOURCE_FOLDER,
  GCP_PROJECT_NAME
} = process.env;
const bucket = GCP_STORAGE_NAME && storage.bucket(GCP_STORAGE_NAME);
const triggerNameRegex = `${FUNCTIONS_SOURCE_FOLDER}/(.*).zip`;

const triggerCloudBuild = async (
  requests: FunctionMetadata[],
  source: string
) => {
  const secretText = await getSecret(TRIGGER_SECRET!);
  const apiKey = await getSecret(TRIGGER_API_KEY_SECRET!);

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
      logger.error({
        message: `Build trigger error: ${response.status} ${response.statusText}`
      });
    }
  }
};

export const deploy = async (file: { bucket: string; name: string }) => {
  if (!bucket) {
    throw Error("Unable to connect to a storage bucket");
  }

  if (!TRIGGER_SECRET) {
    throw Error("TRIGGER_SECRET has not been set");
  }

  if (!TRIGGER_API_KEY_SECRET) {
    throw Error("TRIGGER_API_KEY_SECRET has not been set");
  }

  logger.info({ message: `Bucket: ${file.bucket}` });
  logger.info({ message: `File: ${file.name}` });

  const match = file.name.match(triggerNameRegex);
  if (!match) {
    logger.warning({
      message: "Invalid source folder recieved. Skipping the deployment."
    });
    return;
  }

  const metadataFile = bucket.file(
    `${FUNCTIONS_METADATA_FOLDER}/${FUNCTIONS_METADATA_FILE}`
  );

  if (!(await metadataFile.exists())) {
    logger.warning({
      message: "Metadata file not found. Skipping the deployment."
    });
    return;
  }

  logger.info({ message: `file: ${metadataFile.name}` });
  try {
    const fileContent = await metadataFile.download();
    const metadata = filterFunctionMetadata(fileContent, file.name);
    if (metadata) {
      await triggerCloudBuild(metadata, match[1]);
    } else {
      logger.warning({
        message: `Metadata file not found for ${file.name} source`
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error({ message: error.message });
  }
};
