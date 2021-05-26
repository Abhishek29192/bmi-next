import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

export const getSecret = async (key) => {
  const { GCP_SECRET_PROJECT } = process.env;
  const values = await client.accessSecretVersion({
    name: `projects/${GCP_SECRET_PROJECT}/secrets/${key}/versions/latest`
  });
  return values[0].payload.data.toString();
};
