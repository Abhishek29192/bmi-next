import { Asset, Entry } from "contentful-management";

const TAG_PREFIX = "market__";

export const findLocalesFromTag = (
  entity: Entry | Asset,
  marketLocales: { [key: string]: string[] }
): string[] | undefined => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regEx = new RegExp(`^${TAG_PREFIX}(.*)`);

  const marketId = entity.metadata?.tags?.map((tag) =>
    tag.sys.id.match(regEx)
  )?.[0]?.[1];

  if (!marketId) {
    return undefined;
  }

  return marketLocales[marketId.toString()];
};
