import logger from "@bmi-digital/functions-logger";
import { ContentfulWebhook } from "./types";

// 'Tag ID' of the market-specifier tag in contentful must be prefixed with the following.
// i.e. market__norway
const TAG_PREFIX = "market__";

export const FindBuildWebhook = (
  contentfulWebhook: ContentfulWebhook
): string | null => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regEx = new RegExp(`^${TAG_PREFIX}(.*)`);

  const marketId = contentfulWebhook.metadata?.tags?.map((tag) =>
    tag.sys.id.match(regEx)
  )?.[0]?.[1];

  if (!marketId) {
    logger.warning({ message: "Market tag not found." });
    return null;
  }

  logger.debug({ message: `Market ID: ${marketId}.` });

  const buildWebhooks = JSON.parse(
    process.env.PREVIEW_BUILD === "true"
      ? process.env.PREVIEW_BUILD_WEBHOOKS!
      : process.env.BUILD_WEBHOOKS!
  );

  return buildWebhooks[marketId as string];
};
