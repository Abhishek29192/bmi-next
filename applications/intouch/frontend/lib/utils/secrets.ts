import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

let client;

export const getSecret = async (project, key) => {
  if (!client) {
    client = new SecretManagerServiceClient();
  }

  const values = await client.accessSecretVersion({
    name: `projects/${project}/secrets/${key}/versions/latest`
  });
  return values?.[0]?.payload?.data?.toString();
};
