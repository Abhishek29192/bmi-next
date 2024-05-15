import { pathToFileURL } from "node:url";
import { types } from "node:util";
import { waitFor } from "@bmi/utils";
import contentfulManagement from "contentful-management";
import "dotenv/config";
import ora from "ora";
import { cleanupOldEnvironments } from "./cleanup.js";
import { runMigrationScripts } from "./migrationScripts.js";
import type { Environment, Space } from "contentful-management";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_ALIAS,
  DELETE_OLD_ENVIRONMENTS,
  MANAGEMENT_ACCESS_TOKEN,
  NEW_ENVIRONMENT_NAME,
  SPACE_ID,
  TIMEOUT,
  TIMEOUT_CHECKS
} = process.env;

let timeout = 60 * 60 * 1000; // 60 minutes
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
  newEnvironmentName?: string,
  contentfulAlias?: string
) => {
  if (!newEnvironmentName) {
    await runMigrationScripts(
      spaceId,
      contentfulEnvironment,
      managementAccessToken
    );
    return;
  }

  const client = contentfulManagement.createClient({
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

  try {
    await isItCooked(newEnvironmentName, space);
  } catch (error) {
    timer.fail((error as Error).message);
    await newEnv.delete();
    throw error;
  }

  timer.succeed("Contentful environment created.");

  try {
    await runMigrationScripts(
      spaceId,
      newEnvironmentName,
      managementAccessToken
    );
  } catch (error) {
    await newEnv.delete();
    throw new Error(
      `Migration failed on contentful environment ${newEnvironmentName}, please check the error log above.`
    );
  }

  console.log(
    `Pointing contentful alias ${contentfulAlias || contentfulEnvironment} to ${
      newEnv.sys.id
    }`
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
    NEW_ENVIRONMENT_NAME,
    CONTENTFUL_ALIAS
  );
};

// istanbul ignore if - can't override require.main
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
