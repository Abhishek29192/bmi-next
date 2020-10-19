#!/usr/bin/env node
"use strict";

const { spawnSync } = require("child_process");
const contentful = require("contentful-management");
const { compareSemVer, isValidSemVer, parseSemVer } = require("semver-parser");

const { MANAGEMENT_ACCESS_TOKEN, SPACE_ID } = process.env;

const PRODUCTION_BRANCH = "production";
const PRE_PRODUCTION_BRANCH = "pre-production";
const DEV_MAIN_BRANCH = "master";

const CONTENTFUL_PRODUCTION_BRANCH = "master";
const CONTENTFUL_PRE_PRODUCTION_BRANCH = "pre-production";
const CONTENTFUL_DEV_MAIN_BRANCH = "development";

function parseCIEnvironments() {
  let { BRANCH, INCOMING_HOOK_TITLE, INCOMING_HOOK_BODY } = process.env;

  const targetBranch = BRANCH;
  const isTriggeredByContentful =
    INCOMING_HOOK_TITLE === "Contentful integration";

  let tag = "";

  if (INCOMING_HOOK_BODY) {
    const { event_name, ref } = JSON.parse(INCOMING_HOOK_BODY);

    if (event_name === "tag_push") {
      tag = ref.replace("refs/tags/", "");
    }
  }

  return {
    isTriggeredByContentful,
    targetBranch,
    tag
  };
}

async function buildContentful(branch, tag, isTriggeredByContentful) {
  // NOTE: do not need to create new contentful environment if target brach is DEV_MAIN_BRANCH (MR merged into DEV_MAIN_BRANCH) or if it is a trigger from contentful netlify app
  if (branch === DEV_MAIN_BRANCH || isTriggeredByContentful) {
    const targetContentfulEnvironment = {
      [PRODUCTION_BRANCH]: CONTENTFUL_PRODUCTION_BRANCH,
      [PRE_PRODUCTION_BRANCH]: CONTENTFUL_PRE_PRODUCTION_BRANCH,
      [DEV_MAIN_BRANCH]: CONTENTFUL_DEV_MAIN_BRANCH
    }[branch];

    if (!targetContentfulEnvironment) {
      console.log(
        `Build triggered on git branch ${branch} and is not one of${[
          PRODUCTION_BRANCH,
          PRE_PRODUCTION_BRANCH,
          DEV_MAIN_BRANCH
        ].join(", ")}, skipping all migration.`
      );
      return;
    }

    console.log(
      `Running migration on contentful environment ${targetContentfulEnvironment}...`
    );

    const sub = spawnSync(
      "migrate",
      ["up", "-e", targetContentfulEnvironment, "-a"],
      {
        stdio: "inherit"
      }
    );

    if (sub.status !== 0) {
      throw new Error(
        `Migration failed on contentful environment ${targetContentfulEnvironment}, please check the error log above.`
      );
    }

    return;
  }

  if (!isValidSemVer(tag)) {
    throw new Error(
      `Tag ${tag} is not a valid semver, no contentful environment will be created.`
    );
  }

  const semver = parseSemVer(tag);

  // NOTE: this scenario should be blocked by netlify plugin already, but it is here for a safely check in case of misconfiguration.
  if (!semver.pre && branch === PRE_PRODUCTION_BRANCH) {
    throw new Error(
      `CI should skip tag without pre release part (tag: ${tag}) deployed on ${PRE_PRODUCTION_BRANCH} branch`
    );
  }

  // NOTE: this scenario should be blocked by netlify plugin already, but it is here for a safely check in case of misconfiguration.
  if (semver.pre && branch === PRODUCTION_BRANCH) {
    throw new Error(
      `CI should skip tag with pre release part (tag: ${tag}) deployed on ${PRODUCTION_BRANCH} branch`
    );
  }

  const client = contentful.createClient({
    accessToken: MANAGEMENT_ACCESS_TOKEN
  });
  const space = await client.getSpace(SPACE_ID);
  let envs = await space.getEnvironments();

  const requiredContentfulAliases = [
    CONTENTFUL_PRE_PRODUCTION_BRANCH,
    CONTENTFUL_PRODUCTION_BRANCH
  ];

  const aliases = await space.getEnvironmentAliases();
  if (
    aliases.items.filter((alias) =>
      requiredContentfulAliases.includes(alias.sys.id)
    ).length !== requiredContentfulAliases.length
  ) {
    throw new Error(
      `You must have the following aliases created in Contentful: ${requiredContentfulAliases.join(
        ", "
      )}`
    );
  }

  const existEnv = envs.items.find((env) => env.sys.id === tag);

  // NOTE: if someone re-trigger the deployment manually from netlify
  if (existEnv) {
    console.log(
      `Contentful environment ${tag} has already been created previously.
The script will stop building and migrating on this contentful environment and exit without error to allow the next build step to continue in the pipeline.
If you wish to rebuild contentful environment, consider creating a new tag or manually deleting ${tag} contentful environment and updating related aliases before re-trigger the build.`
    );
    return;
  }

  if (branch === PRE_PRODUCTION_BRANCH) {
    const newestPreReleaseEnv = envs.items
      .filter((env) => isValidSemVer(env.sys.id) && parseSemVer(env.sys.id).pre)
      .sort((b, a) => compareSemVer(a.sys.id, b.sys.id))[0];

    if (
      newestPreReleaseEnv &&
      compareSemVer(tag, newestPreReleaseEnv.sys.id) < 1
    ) {
      throw new Error(
        `Release ${tag} is older than newest pre-release environment ${newestPreReleaseEnv.sys.id} on contentful`
      );
    }
  }

  if (branch === PRODUCTION_BRANCH) {
    const newestReleaseEnv = envs.items
      .filter(
        (env) => isValidSemVer(env.sys.id) && !parseSemVer(env.sys.id).pre
      )
      .sort((b, a) => compareSemVer(a.sys.id, b.sys.id))[0];

    if (newestReleaseEnv && compareSemVer(tag, newestReleaseEnv.sys.id) < 1) {
      throw new Error(
        `Release ${tag} is older than newest environment ${newestReleaseEnv.sys.id} on contentful`
      );
    }
  }

  console.log(
    `Creating new contentful environment ${tag} from ${CONTENTFUL_PRODUCTION_BRANCH}`
  );

  let newEnv = await space.createEnvironmentWithId(
    tag,
    { name: tag },
    CONTENTFUL_PRODUCTION_BRANCH
  );

  console.log(`Running migration on contentful environment ${tag}...`);

  const sub = spawnSync("migrate", ["up", "-e", tag, "-a"], {
    stdio: "inherit"
  });

  if (sub.status !== 0) {
    // NOTE: remove newly created environment if migration failed
    console.log(
      `Deleting contentful environment ${newEnv.sys.id} as migration failed...`
    );
    const _env = await space.getEnvironment(newEnv.sys.id);
    await _env.delete();
    throw new Error(
      `Migration failed on contentful environment ${tag}, please check the error log above.`
    );
  }

  // NOTE: refresh the env lists after creating
  envs = await space.getEnvironments();

  while (newEnv.sys.status.sys.id !== "ready") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    newEnv = await space.getEnvironment(newEnv.sys.id);
  }

  console.log(
    `Pointing pre-production contentful environment ${CONTENTFUL_PRE_PRODUCTION_BRANCH} to ${newEnv.sys.id}`
  );

  const preProdAlias = await space.getEnvironmentAlias(
    CONTENTFUL_PRE_PRODUCTION_BRANCH
  );

  preProdAlias.environment.sys.id = newEnv.sys.id;
  await preProdAlias.update();

  if (branch === PRE_PRODUCTION_BRANCH) {
    for (const env of envs.items) {
      // NOTE: delete any old pre release environments for pre-production release
      if (env.sys.id !== tag && parseSemVer(env.sys.id).pre) {
        console.log(
          `Deleting old pre-release contentful environment ${env.sys.id}`
        );
        await env.delete();
      }
    }
    return;
  }

  if (branch === PRODUCTION_BRANCH) {
    console.log(
      `Pointing production contentful environment ${CONTENTFUL_PRODUCTION_BRANCH} to ${newEnv.sys.id}`
    );
    const prodAlias = await space.getEnvironmentAlias(
      CONTENTFUL_PRODUCTION_BRANCH
    );
    prodAlias.environment.sys.id = newEnv.sys.id;
    await prodAlias.update();

    for (const env of envs.items) {
      // NOTE: delete any pre release environments for production release
      if (parseSemVer(env.sys.id).pre) {
        console.log(
          `Deleting pre-release contentful environment ${env.sys.id}`
        );
        await env.delete();
      }
    }

    const sortedEnvVersions = envs.items
      .filter(
        (env) => isValidSemVer(env.sys.id) && !parseSemVer(env.sys.id).pre
      )
      .sort((b, a) => compareSemVer(a.sys.id, b.sys.id));

    // NOTE: only keep latest 2 environments, current and last contentful environment
    for (const env of sortedEnvVersions.slice(2)) {
      console.log(`Deleting old contentful environment ${env.sys.id}`);
      await env.delete();
    }
  }
}

async function main() {
  const { targetBranch, tag, isTriggeredByContentful } = parseCIEnvironments();

  console.log(`Build environment information:`, {
    targetBranch,
    tag,
    isTriggeredByContentful
  });

  try {
    if (!targetBranch) {
      throw new Error("You must run this command in netlify CI environment");
    }

    await buildContentful(targetBranch, tag, isTriggeredByContentful);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
