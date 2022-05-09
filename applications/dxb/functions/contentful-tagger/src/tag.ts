import { Asset, Entry, Link } from "contentful-management";

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
