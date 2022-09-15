import { Space } from "contentful-management";
import { compareSemVer, isValidSemVer, parseSemVer } from "semver-parser";

export const cleanupOldEnvironments = async (tag: string, space: Space) => {
  const envs = await space.getEnvironments();
  const allAliases = await space.getEnvironmentAliases();
  const aliasedEnvIds = allAliases.items.map((x) => x.environment.sys.id);

  console.log("Skipping aliased versions:");
  aliasedEnvIds.forEach((envId) => console.log(envId));

  const sortedEnvVersions = envs.items
    .filter((env) => isValidSemVer(env.sys.id))
    .sort((b, a) => compareSemVer(a.sys.id, b.sys.id));

  const majorEnvironments = sortedEnvVersions.filter(
    (env) => !parseSemVer(env.sys.id).pre
  );

  if (majorEnvironments.length > 0) {
    console.log("Skipping previous major version:");
    console.log(majorEnvironments[0].sys.id);
    console.log(majorEnvironments[1].sys.id);
  }

  if (sortedEnvVersions.length > 1) {
    await Promise.allSettled(
      sortedEnvVersions
        .filter(
          (env) =>
            env.sys.id !== tag &&
            !aliasedEnvIds.includes(env.sys.id) &&
            majorEnvironments[0]?.sys.id !== env.sys.id &&
            majorEnvironments[1]?.sys.id !== env.sys.id
        )
        .map(async (env) => {
          console.log(`Deleting contentful environment: ${env.sys.id}`);
          await env.delete();
        })
    );
  }
};
