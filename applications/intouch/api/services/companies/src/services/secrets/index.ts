import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const { GCP_SECRET_PROJECT } = process.env;

const client = new SecretManagerServiceClient();

// eslint-disable detect-object-injection
export const setEnvFromSecrets = async (keys) => {
  const secrets = keys.map(({ secret, env }) => {
    // if the env for this key exists I return the env
    if (process.env[`${env}`]) return process.env[`${env}`];

    // return the promise to fetch the secret
    return client.accessSecretVersion({
      name: `projects/${GCP_SECRET_PROJECT}/secrets/${secret}/versions/latest`
    });
  });

  const results = await Promise.all(secrets);

  return keys.reduce((result, { secret, env }, index) => {
    // if the result of the promise is a string means that we already have an env
    // so we return the string
    if (typeof results[`${index}`] === "string") {
      return {
        ...result,
        [secret]: results[`${index}`]
      };
    }

    const secretValue = results[`${index}`][0].payload.data.toString();
    // set the secret as env (if env is passed as param)
    if (env) {
      process.env[`${env}`] = secretValue;
    }

    return {
      ...result,
      [secret]: secretValue
    };
  }, {});
};
