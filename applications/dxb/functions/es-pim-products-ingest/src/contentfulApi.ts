import { AssetType, Resources } from "@bmi/contentful-types";
import { getContentfulClient } from "@bmi/functions-contentful-client";
import { ProductDocumentNameMap } from "./types";

const getAssetTypes = async (
  locale: string,
  tag?: string
): Promise<{ code: string; name: string; pimCode: string }[]> => {
  const client = getContentfulClient();
  const assetTypes = await client.getEntries<AssetType>({
    content_type: "assetType",
    locale,
    ...(tag && { "metadata.tags.sys.id[all]": tag })
  });

  return assetTypes.items
    .filter(({ fields: { pimCode } }) => pimCode)
    .map(({ fields: { name, code, pimCode } }) => ({
      name,
      code,
      pimCode: pimCode!
    }));
};

const getProductDocumentNameMap = async (
  locale: string,
  tag?: string
): Promise<ProductDocumentNameMap> => {
  const client = getContentfulClient();
  const resources = await client.getEntries<Resources>({
    content_type: "resources",
    limit: 1,
    locale,
    ...(tag && { "metadata.tags.sys.id[all]": tag })
  });
  if (resources.items.length === 0) {
    throw new Error("Unable to find resources.");
  }
  return resources.items[0].fields.productDocumentNameMap || "Document name";
};

export { getAssetTypes, getProductDocumentNameMap };
