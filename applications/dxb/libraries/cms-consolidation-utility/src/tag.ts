import type { Asset, Entry, Environment, Link } from "contentful-management";

const buildTagId = (market: string) => {
  return `market__${market.replace(/ /g, "").toLowerCase()}`;
};

export const tagEntity = async (
  entity: Entry | Asset,
  market: string
): Promise<boolean> => {
  const tags: Link<"Tag">[] | undefined = entity.metadata?.tags;
  if (
    tags?.some(
      (tag) =>
        tag.sys.linkType === "Tag" && tag.sys.id === `${buildTagId(market)}`
    )
  ) {
    console.log(`DXB market tag found on :${entity.sys.id}`);
    return false;
  } else {
    tags?.push({
      sys: {
        type: "Link",
        linkType: "Tag",
        id: `${buildTagId(market)}`
      }
    });
    return true;
  }
};

export const createTag = async (
  environment: Environment,
  market: string
): Promise<void> => {
  const tagId = `${buildTagId(market)}`;
  console.log(`Try create tag: ${tagId}`);
  environment
    .getTag(tagId)
    .then(() => console.warn(`Tag with the ID: ${tagId} already exists.`))
    .catch(async (err) => {
      const errorMessage = JSON.parse(err.message);
      if (errorMessage.status === 404) {
        console.log(`Creating the tag ${tagId}`);
        await environment.createTag(tagId, market, "public");
      } else {
        console.error(`Error ${err}`);
      }
    });
};
