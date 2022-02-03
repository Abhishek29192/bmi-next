import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

let client: SecretManagerServiceClient | undefined;

export const getSecret = async (project, key) => {
  if (!client) {
    client = new SecretManagerServiceClient();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- For some reason, eslint doesn't always like optional chained calls
  const values = await client.accessSecretVersion({
    name: `projects/${project}/secrets/${key}/versions/latest`
  });
  return values[0].payload?.data?.toString();
};
