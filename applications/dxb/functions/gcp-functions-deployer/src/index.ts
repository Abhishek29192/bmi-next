import logger from "@bmi-digital/functions-logger";
import { Storage } from "@google-cloud/storage/build/src/storage";
import fetch from "node-fetch";
import { filterFunctionMetadata } from "./filter";
import { FunctionMetadata } from "./types";

const storage = new Storage();
const {
  GCP_STORAGE_NAME,
  TRIGGER_CB_SECRET,
  TRIGGER_API_KEY,
  FUNCTIONS_METADATA_FOLDER,
  FUNCTIONS_METADATA_FILE,
  FUNCTIONS_SOURCE_FOLDER,
  GCP_PROJECT_NAME,
  LOCATION
} = process.env;
const bucket = GCP_STORAGE_NAME && storage.bucket(GCP_STORAGE_NAME);
const triggerNameRegex = `${FUNCTIONS_SOURCE_FOLDER}/(.*).zip`;

const triggerCloudBuild = async (
  requests: FunctionMetadata[],
  source: string
) => {
  const triggerName = `${source}-trigger`;
  const url = `https://${LOCATION}cloudbuild.googleapis.com/v1/projects/${GCP_PROJECT_NAME}/triggers/${triggerName}:webhook?key=${TRIGGER_API_KEY}&secret=${TRIGGER_CB_SECRET}`;

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

  if (!TRIGGER_CB_SECRET) {
    throw Error("TRIGGER_CB_SECRET has not been set");
  }

  if (!TRIGGER_API_KEY) {
    throw Error("TRIGGER_API_KEY has not been set");
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
  } catch (error) {
    logger.error({ message: (error as Error).message });
  }
};
