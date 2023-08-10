import logger from "@bmi-digital/functions-logger";
import fetch from "node-fetch";

export const generateGoogleSignedIdToken = async (
  audience: string
): Promise<string | undefined> => {
  try {
    // Constants for setting up metadata server request
    // See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
    const tokenUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${audience}`;

    // fetch the auth token
    const tokenResponse = await fetch(tokenUrl, {
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    return await tokenResponse.text();
  } catch (error) {
    logger.error({
      message: `Error whilst trying to fetch the gcp signed-id token. ${error}`
    });
    return undefined;
  }
};
