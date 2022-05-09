import { Asset, Entry, Link, Environment } from "contentful-management";

const BuildTagId = (market: string) => {
  return `market__${market.replace(/ /g, "").toLowerCase()}`;
};

export const TagEntity = async (
  entity: Entry | Asset,
  market: string
): Promise<void> => {
  const tags: Link<"Tag">[] | undefined = entity.metadata?.tags;
  if (
    tags?.some(
      (tag) =>
        tag.sys.linkType === "Tag" && tag.sys.id === `${BuildTagId(market)}`
    )
  ) {
    console.log(`DXB market tag found on :${entity.sys.id}`);
  } else {
    tags?.push({
      sys: {
        type: "Link",
        linkType: "Tag",
        id: `${BuildTagId(market)}`
      }
    });
  }
};

export const CreateTag = async (
  environment: Environment,
  market: string
): Promise<void> => {
  const tagId = `${BuildTagId(market)}`;
  console.log(`Try create tag: ${tagId}`);
  environment
    .getTag(tagId)
    .then((value) => console.warn(`Tag with the ID: ${tagId} already exists.`))
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
