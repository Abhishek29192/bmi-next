#!/usr/bin/env node
"use strict";

const { execSync, spawnSync } = require("child_process");
const contentful = require("contentful-management");
const { compareSemVer, isValidSemVer, parseSemVer } = require("semver-parser");
const ora = require("ora");

const { MANAGEMENT_ACCESS_TOKEN, SPACE_ID } = process.env;

const PRODUCTION_BRANCH = "production";
const PRE_PRODUCTION_BRANCH = "pre-production";
const DEV_MAIN_BRANCH = "master";

const CONTENTFUL_PRODUCTION_BRANCH = "master";
const CONTENTFUL_PRE_PRODUCTION_BRANCH = "pre-production";
const CONTENTFUL_DEV_MAIN_BRANCH = "development";

const allowedHooks = ["Gitlab Tag Trigger"];

const getCurrentCommitTag = () => {
  console.log("Trying to get the tag from the commit information.");

  try {
    const tag = execSync(`git describe --tags --abbrev=0 --exact-match`)
      .toString()
      .trim();

    console.log(`Found tag ${tag}`);
    return tag;
  } catch (err) {
    return null;
  }
};

const getTagFromHookBody = (body) => {
  console.log("Trying to get the tag from the hook body.");

  if (!body) {
    return null;
  }

  const { event_name, ref } = JSON.parse(body);

  if (event_name !== "tag_push") {
    return null;
  }

  const tag = ref.replace("refs/tags/", "");

  return tag;
};

function parseCIEnvironments() {
  let { BRANCH, INCOMING_HOOK_TITLE, INCOMING_HOOK_BODY } = process.env;

  const targetBranch = BRANCH;
  const shouldBuild =
    targetBranch === DEV_MAIN_BRANCH ||
    (INCOMING_HOOK_TITLE && INCOMING_HOOK_TITLE.includes(allowedHooks));

  const tag = getTagFromHookBody(INCOMING_HOOK_BODY) || getCurrentCommitTag();

  if (tag) {
    console.log(`Found tag ${tag}`);
  }

  return {
    shouldBuild,
    targetBranch,
    tag
  };
}

const getTargetContentfulEnvironment = (branch) =>
  ({
    [PRODUCTION_BRANCH]: CONTENTFUL_PRODUCTION_BRANCH,
    [PRE_PRODUCTION_BRANCH]: CONTENTFUL_PRE_PRODUCTION_BRANCH,
    [DEV_MAIN_BRANCH]: CONTENTFUL_DEV_MAIN_BRANCH
  }[branch]);

const wait = (aBit = 1000) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, aBit)
  );
};

const isItCooked = (tag, space, attempts = 0) => {
  if (attempts === 100) {
    return;
  }

  return space
    .getEnvironment(tag)
    .then((newEnvironment) => {
      if (newEnvironment.sys.status.sys.id !== "ready") {
        throw "Status is not ready.";
      }

      return newEnvironment;
    })
    .catch(async () => {
      await wait();

      return isItCooked(tag, space, attempts + 1);
    });
};

async function isEnvAliased(env, space) {
  const allAliases = await space.getEnvironmentAliases();
  for (const alias of allAliases.items) {
    if (alias.environment.sys.id === env.sys.id) {
      return true;
    }
  }
  return false;
}

async function cleanupOldEnvironments(tag, envs, space) {
  const sortedEnvVersions = envs.items
    .filter((env) => isValidSemVer(env.sys.id))
    .sort((b, a) => compareSemVer(a.sys.id, b.sys.id));

  const prevMajEnvs = sortedEnvVersions.filter(
    (env) => !parseSemVer(env.sys.id).pre && env.sys.id !== tag
  );

  // want to keep at least 1 major versions (newest and previous)
  if (sortedEnvVersions.length > 1) {
    for (const env of sortedEnvVersions.slice(1)) {
      // 1. not the current tagged env
      const isntTaggedEnv = env.sys.id !== tag;
      // 2. isn't aliased
      const isntAliased = !(await isEnvAliased(env, space));
      // 3. isn't prev maj version
      const isntPrevMaj =
        prevMajEnvs.length > 0 && prevMajEnvs[0].sys.id !== env.sys.id;

      if (isntTaggedEnv && isntAliased && isntPrevMaj) {
        console.log(`Deleting contentful environment ${env.sys.id}`);
        await env.delete();
      } else {
        console.log(`NOT Deleting contentful environment ${env.sys.id}.`);
      }
    }
  }
}

async function buildContentful(branch, tag) {
  const targetContentfulEnvironment = getTargetContentfulEnvironment(branch);
  // NOTE: do not need to create new contentful environment if target brach is DEV_MAIN_BRANCH (MR merged into DEV_MAIN_BRANCH) or if it is a trigger from contentful netlify app
  if (branch === DEV_MAIN_BRANCH) {
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

  if (!tag) {
    console.log(
      "No tag found. Skipping the contentful build process and will exit without error to allow the next build step to continue in the pipeline."
    );

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
  let newEnv;
  try {
    newEnv = await space.createEnvironmentWithId(
      tag,
      { name: tag },
      CONTENTFUL_PRODUCTION_BRANCH
    );
  } catch (error) {
    console.log(
      "Something went wrong while creating the contentful environment. See more details below."
    );
    throw new Error(error);
  }

  const timer = ora(
    'Waiting for the new environment status to become "Ready"'
  ).start();

  await isItCooked(tag, space);

  timer.succeed("Contentful environment created.");

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

  if (branch === PRODUCTION_BRANCH) {
    console.log(
      `Pointing production contentful environment ${CONTENTFUL_PRODUCTION_BRANCH} to ${newEnv.sys.id}`
    );
    const prodAlias = await space.getEnvironmentAlias(
      CONTENTFUL_PRODUCTION_BRANCH
    );
    prodAlias.environment.sys.id = newEnv.sys.id;
    await prodAlias.update();
  }

  if (branch === PRE_PRODUCTION_BRANCH || branch === PRODUCTION_BRANCH) {
    await cleanupOldEnvironments(tag, envs, space);
  }
}

async function main([shouldBuild, targetBranch, tag]) {
  if (!targetBranch && !tag && !shouldBuild) {
    console.log("No arguments passed into main. Try to parse webhook");
    ({ targetBranch, tag, shouldBuild } = parseCIEnvironments());
  }

  console.log(`Build environment information:`, {
    targetBranch,
    tag,
    shouldBuild
  });

  if (!shouldBuild) {
    console.log(
      `Only builds triggered by ${allowedHooks.join(
        ", "
      )} or gitlab jobs are allowed. The script will stop building and migrating, and will exit without error to allow the next build step to continue in the pipeline.`
    );

    return;
  }

  try {
    if (!targetBranch) {
      throw new Error("You must run this command in netlify CI environment");
    }

    await buildContentful(targetBranch, tag);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main(process.argv.slice(2));
