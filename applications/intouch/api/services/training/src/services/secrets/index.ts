import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const { GCP_SECRET_PROJECT } = process.env;

const client = new SecretManagerServiceClient();

// eslint-disable detect-object-injection
export const setEnvFromSecrets = async (keys) => {
  const secrets = keys.map(({ secret, env }) => {
    if (process.env[`${env}`]) return process.env[`${env}`];

    return client.accessSecretVersion({
      name: `projects/${GCP_SECRET_PROJECT}/secrets/${secret}/versions/latest`
    });
  });

  const results = await Promise.all(secrets);

  return keys.reduce((result, { secret, env }, index) => {
    if (typeof results[`${index}`] === "string") {
      return {
        ...result,
        [secret]: results[`${index}`]
      };
    }

    if (env) {
      process.env[`${env}`] = results[`${index}`][0].payload.data.toString();
    }

    return {
      ...result,
      [secret]: results[`${index}`][0].payload.data.toString()
    };
  }, {});
};
