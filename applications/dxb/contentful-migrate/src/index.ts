import { types } from "util";
import { createClient, Environment, Space } from "contentful-management";
import "dotenv/config";
import ora from "ora";
import { waitFor } from "@bmi/utils";
import { runMigrationScripts } from "./migrationScripts";
import { cleanupOldEnvironments } from "./cleanup";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_ALIAS,
  DELETE_OLD_ENVIRONMENTS,
  MANAGEMENT_ACCESS_TOKEN,
  MIGRATION_DRY_RUN,
  NEW_ENVIRONMENT_NAME,
  SPACE_ID,
  TIMEOUT,
  TIMEOUT_CHECKS
} = process.env;

let timeout = 20 * 60 * 1000; // 20 minutes
let timeoutChecks = 10 * 1000; // 10 seconds

const isItCooked = async (
  tag: string,
  space: Space,
  attempts = 0
): Promise<Environment> => {
  const maxAttempts = timeout / timeoutChecks;
  if (attempts === maxAttempts) {
    throw new Error(
      `Hit the max attempts whilst waiting for the Contentful environment ${tag} to be created.`
    );
  }

  const newEnvironment = await space.getEnvironment(tag);
  if (newEnvironment.sys.status.sys.id === "ready") {
    return newEnvironment;
  }

  await waitFor(timeoutChecks);
  return isItCooked(tag, space, attempts + 1);
};

const buildContentful = async (
  spaceId: string,
  contentfulEnvironment: string,
  managementAccessToken: string,
  deleteOldEnvironments: boolean,
  isDryRun: boolean,
  newEnvironmentName?: string,
  contentfulAlias?: string
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
    if (
      !types.isNativeError(error) ||
      JSON.parse(error.message).status !== 404
    ) {
      console.log(error);
      throw error;
    }
  }

  let alias;
  try {
    alias = await space.getEnvironmentAlias(
      contentfulAlias || contentfulEnvironment
    );
  } catch (error) {
    if (
      types.isNativeError(error) &&
      JSON.parse(error.message).status === 404
    ) {
      throw new Error(
        `You must have the alias ${
          contentfulAlias || contentfulEnvironment
        } created in Contentful`
      );
    }
    throw error;
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

export const main = async () => {
  if (!CONTENTFUL_ENVIRONMENT) {
    throw new Error("Missing CONTENTFUL_ENVIRONMENT environment variable.");
  }

  if (!MANAGEMENT_ACCESS_TOKEN) {
    throw new Error("Missing MANAGEMENT_ACCESS_TOKEN environment variable.");
  }

  if (!SPACE_ID) {
    throw new Error("Missing SPACE_ID environment variable.");
  }

  if (TIMEOUT) {
    timeout = Number.parseInt(TIMEOUT);
  }

  if (TIMEOUT_CHECKS) {
    timeoutChecks = Number.parseInt(TIMEOUT_CHECKS);
  }

  await buildContentful(
    SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    MANAGEMENT_ACCESS_TOKEN,
    DELETE_OLD_ENVIRONMENTS === "true",
    MIGRATION_DRY_RUN === "true",
    NEW_ENVIRONMENT_NAME,
    CONTENTFUL_ALIAS
  );
};

// istanbul ignore if - can't override require.main
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
