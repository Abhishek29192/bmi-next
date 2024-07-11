import { isDefined } from "@bmi/utils";
import getContentfulData from "../../utils/getContentfulData";
import {
  richTextAssetReferencesQuery,
  richTextEntryReferencesQuery
} from "../queries/richTextReferences";
import resolveLink from "./ContentfulLink";
import { getUrlFromPath, resolvePath } from "./utils/path";
import type { TableFields as TableData } from "../../components/EmbeddedTable";
import type { ContentfulLink } from "./types/Link";
import type { RichTextData } from "../../components/RichText";
import type { ContentfulRichText } from "./types/RichText";
import type { FileData } from "../../components/EmbeddedAssetBlock";
import type { PageData } from "../../components/InlineHyperlink";
import type { Inline, Block } from "@contentful/rich-text-types";
import type { ParentPage } from "./types/Common";

export type InlinePage = Omit<PageData, "path"> & {
  title: string;
  //Slug will be always set to null for entries of Home Page content type
  slug: string | null;
  sys: {
    id: string;
  };
  parentPage: ParentPage | null;
};

export type RichTextTable = TableData & {
  sys: {
    id: string;
  };
};

export type EntryData = RichTextTable | ContentfulLink | InlinePage;

export type AssetData = FileData & {
  sys: {
    id: string;
  };
};

const resolveRichText = async (
  richText: ContentfulRichText
): Promise<RichTextData> => {
  //try {
  const content = richText.json.content;

  const assetIds = getEntryIds(content, "Asset");
  const entryIds = getEntryIds(content, "Entry");

  const assets = assetIds.length
    ? await getContentfulData<{ assetCollection: { items: AssetData[] } }>(
        richTextAssetReferencesQuery,
        { assetIds }
      )
    : undefined;

  const entries = entryIds.length
    ? await getContentfulData<{
        entryCollection: { items: EntryData[] };
      }>(richTextEntryReferencesQuery, { entryIds })
    : undefined;

  if (assets?.errors) {
    throw new Error(JSON.stringify(assets.errors));
  }

  if (entries?.errors) {
    throw new Error(JSON.stringify(entries.errors));
  }

  const referencesMap: RichTextData["references"] = new Map();

  if (entries?.data.entryCollection?.items.length) {
    for await (const entry of entries.data.entryCollection.items) {
      if (entry.__typename === "Link") {
        const resolvedLink = await resolveLink(entry);
        referencesMap.set(entry.sys.id, resolvedLink);
        continue;
      }

      if (isPageEntry(entry)) {
        const path = await resolvePath({
          title: entry.title,
          slug: entry.slug || "",
          sys: entry.sys,
          parentPage: entry.parentPage
        });

        referencesMap.set(entry.sys.id, {
          path: getUrlFromPath(path),
          __typename: entry.__typename
        });
        continue;
      }

      if (entry.__typename === "Table") {
        referencesMap.set(entry.sys.id, entry);
      }
    }
  }

  if (assets?.data.assetCollection?.items.length) {
    assets.data.assetCollection.items.forEach(({ sys, ...rest }) => {
      referencesMap.set(sys.id, rest);
    });
  }

  return {
    json: richText.json,
    references: referencesMap
  };
};

const getEntryId = (
  contentItem:
    | RichTextData["json"]["content"][0]
    | Block["content"][0]
    | Inline["content"][0]
) => contentItem.data.target.sys.id;

const getEntryIds = (
  content:
    | RichTextData["json"]["content"]
    | Block["content"]
    | Inline["content"],
  type: "Entry" | "Asset"
): string[] =>
  content
    .flatMap((item) => {
      const parentItemId =
        item.data.target?.sys?.linkType === type ? getEntryId(item) : undefined;

      if ("content" in item) {
        const childIds = item.content.length
          ? getEntryIds(item.content, type)
          : [];

        return [parentItemId, ...childIds];
      }

      return [parentItemId];
    })
    .filter(isDefined);

const isPageEntry = (entry: EntryData): entry is InlinePage =>
  [
    "HomePage",
    "Page",
    "ContactUsPage",
    "ProductListerPage",
    "DocumentLibraryPage",
    "BrandLandingPage",
    "TrainingListerPage"
  ].includes(entry.__typename);

export default resolveRichText;
