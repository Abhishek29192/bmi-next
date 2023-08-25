import { createClient } from "contentful-management";
import type { Environment } from "contentful-management";

let environmentCache: Environment;

/**
 * @deprecated will be removed in the near future
 */
export const getEnvironment = async () => {
  if (environmentCache) {
    return environmentCache;
  }

  const client = createClient({
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
  });
  const space = await client.getSpace(process.env.SPACE_ID!);

  environmentCache = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT!
  );

  return environmentCache;
};
