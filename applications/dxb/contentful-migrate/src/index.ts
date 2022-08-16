import { migrateUp } from "@bmi-digital/contentful-migration";
import { createClient, Environment, Space } from "contentful-management";
import "dotenv/config";
import ora from "ora";
import { compareSemVer, isValidSemVer, parseSemVer } from "semver-parser";

const {
  CONTENTFUL_ENVIRONMENT,
  DELETE_OLD_ENVIRONMENTS,
  MANAGEMENT_ACCESS_TOKEN,
  MIGRATION_DRY_RUN,
  NEW_ENVIRONMENT_NAME,
  SPACE_ID
} = process.env;

const minutesToCheckForEnv = 20;
const secondsBetweenEnvironmentChecks = 10; // 10 secs
const maxSeconds = minutesToCheckForEnv * 60; // 20 * 60 = 1200

const defaultMilliSecondWait = secondsBetweenEnvironmentChecks * 1000;
const wait = (aBit = defaultMilliSecondWait) => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, aBit)
  );
};

const isItCooked = async (
  tag: string,
  space: Space,
  attempts = 0
): Promise<Environment> => {
  const maxAttempts = maxSeconds / secondsBetweenEnvironmentChecks;
  if (attempts === maxAttempts) {
    throw Error(
      `Hit the max attempts whilst waiting for the Contentful environment ${tag} to be created.`
    );
  }

  try {
    const newEnvironment = await space.getEnvironment(tag);
    if (newEnvironment.sys.status.sys.id !== "ready") {
      throw "Status is not ready.";
    }

    return newEnvironment;
  } catch (error) {
    await wait();
    return isItCooked(tag, space, attempts + 1);
  }
};

const cleanupOldEnvironments = async (tag: string, space: Space) => {
  const envs = await space.getEnvironments();
  const allAliases = await space.getEnvironmentAliases();
  const aliasedEnvIds = allAliases.items.map((x) => x.environment.sys.id);

  console.log("Skipping aliased versions:");
  aliasedEnvIds.forEach((envId) => console.log(envId));

  const sortedEnvVersions = envs.items
    .filter((env) => isValidSemVer(env.sys.id))
    .sort((b, a) => compareSemVer(a.sys.id, b.sys.id));

  const prevMajEnvs = sortedEnvVersions.filter(
    (env) =>
      !parseSemVer(env.sys.id).pre &&
      env.sys.id !== tag &&
      !aliasedEnvIds.includes(env.sys.id)
  );

  console.log("Skipping previous major version:");
  prevMajEnvs.length > 0 && console.log(prevMajEnvs[0].sys.id);

  // want to keep at least 2 major versions (newest and previous)
  const envsExceptNewest = sortedEnvVersions.slice(1);
  if (sortedEnvVersions.length > 1) {
    envsExceptNewest
      .filter(
        (env) =>
          env.sys.id !== tag &&
          !aliasedEnvIds.includes(env.sys.id) &&
          prevMajEnvs.length > 0 &&
          prevMajEnvs[0].sys.id !== env.sys.id
      )
      .forEach(async (env) => {
        console.log(
          `Deleting contentful environment (TESTING ONLY): ${env.sys.id}`
        );
        // TODO: write tests to ensure this logic stays solid, then implement the below delete.
        //await env.delete();
      });
  }
};

const runMigrationScripts = async (
  spaceId: string,
  contentfulAlias: string,
  managementAccessToken: string,
  isDryRun: boolean
) => {
  console.log(
    `Running migration on contentful environment ${contentfulAlias}...`
  );

  const projectPath = __dirname;
  const status = await migrateUp(
    projectPath,
    spaceId,
    contentfulAlias,
    managementAccessToken,
    isDryRun
  );

  if (status !== 0) {
    throw new Error(
      `Migration failed on contentful environment ${contentfulAlias}, please check the error log above.`
    );
  }
  console.log(
    `Finished running migration on contentful environment ${contentfulAlias}.`
  );
};

const isError = (error: unknown): error is Error => {
  return typeof error === "object" && error !== null && "message" in error;
};

const buildContentful = async (
  spaceId: string,
  contentfulEnvironment: string,
  managementAccessToken: string,
  deleteOldEnvironments: boolean,
  isDryRun: boolean,
  newEnvironmentName?: string
) => {
  if (!newEnvironmentName) {
    await runMigrationScripts(
      spaceId,
      contentfulEnvironment,
      managementAccessToken,
      isDryRun
    );
    return;
  }

  const client = createClient({
    accessToken: managementAccessToken
  });
  const space = await client.getSpace(spaceId);
  try {
    await space.getEnvironment(newEnvironmentName);
    console.log(
      `Contentful environment ${newEnvironmentName} has already been created previously.
      The script will stop building and migrating on this contentful environment and exit without error to allow the next build step to continue in the pipeline.
      If you wish to rebuild contentful environment, consider creating a new tag or manually deleting ${newEnvironmentName} contentful environment and updating related aliases before re-trigger the build.`
    );
    return;
  } catch (error) {
    if (!isError(error) || JSON.parse(error.message).status !== 404) {
      console.log(error);
      throw error;
    }
  }

  const alias = await space.getEnvironmentAlias(contentfulEnvironment);
  if (!alias) {
    throw new Error(
      `You must have the alias ${contentfulEnvironment} created in Contentful`
    );
  }

  console.log(
    `Creating new contentful environment ${newEnvironmentName} from ${contentfulEnvironment}`
  );
  const newEnv = await space.createEnvironmentWithId(
    newEnvironmentName,
    { name: newEnvironmentName },
    contentfulEnvironment
  );

  const timer = ora(
    'Waiting for the new environment status to become "Ready"'
  ).start();

  await isItCooked(newEnvironmentName, space);

  timer.succeed("Contentful environment created.");

  try {
    await runMigrationScripts(
      spaceId,
      newEnvironmentName,
      managementAccessToken,
      isDryRun
    );
  } catch (error) {
    await newEnv.delete();
    throw new Error(
      `Migration failed on contentful environment ${newEnvironmentName}, please check the error log above.`
    );
  }

  if (isDryRun) {
    console.log(`Dry run completed, clearing up newly created environment`);
    await newEnv.delete();
    return;
  }

  console.log(
    `Pointing contentful alias ${contentfulEnvironment} to ${newEnv.sys.id}`
  );

  alias.environment.sys.id = newEnv.sys.id;
  await alias.update();

  if (deleteOldEnvironments) {
    await cleanupOldEnvironments(newEnvironmentName, space);
  }
};

const main = async () => {
  console.log({ CONTENTFUL_ENVIRONMENT, SPACE_ID });
  if (!CONTENTFUL_ENVIRONMENT || !MANAGEMENT_ACCESS_TOKEN || !SPACE_ID) {
    throw new Error(
      "Missing env config `CONTENTFUL_ENVIRONMENT` or `MANAGEMENT_ACCESS_TOKEN` or `SPACE_ID`"
    );
  }

  await buildContentful(
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN,
    DELETE_OLD_ENVIRONMENTS === "true",
    MIGRATION_DRY_RUN === "true",
    NEW_ENVIRONMENT_NAME
  );
};

main().catch((error) => {
  console.error(error);
  // TODO: Is this needed?
  process.exit(1);
});
