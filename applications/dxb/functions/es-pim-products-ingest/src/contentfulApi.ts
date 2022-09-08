import logger from "@bmi-digital/functions-logger";
import type { AssetTypeData } from "@bmi/pim-types";
import { createClient, Environment, Space } from "contentful-management";
import { ProductDocumentNameMap } from "./types";

const { LOCALE, MANAGEMENT_ACCESS_TOKEN, SPACE_ID, CONTENTFUL_ENVIRONMENT } =
  process.env;

let spaceCache: Space | undefined;
const getSpace = async (): Promise<Space> => {
  if (!spaceCache) {
    const client = createClient({
      accessToken: MANAGEMENT_ACCESS_TOKEN!
    });

    spaceCache = await client.getSpace(SPACE_ID!);
  }
  return spaceCache;
};

let environmentCache: Environment | undefined;
const getEnvironment = async (space: Space): Promise<Environment> => {
  if (!environmentCache) {
    environmentCache = await space.getEnvironment(CONTENTFUL_ENVIRONMENT!);
  }
  return environmentCache;
};

const getSpaceEnvironment = async (): Promise<Environment | undefined> => {
  if (!process.env.MANAGEMENT_ACCESS_TOKEN) {
    logger.error({
      message: "MANAGEMENT_ACCESS_TOKEN has not been set."
    });
    return;
  }
  if (!process.env.SPACE_ID) {
    logger.error({ message: "SPACE_ID has not been set." });
    return;
  }
  if (!process.env.CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "CONTENTFUL_ENVIRONMENT has not been set." });
    return;
  }
  if (!process.env.LOCALE) {
    logger.error({ message: "LOCALE has not been set." });
    return;
  }
  const space = await getSpace();
  const environment = await getEnvironment(space);

  return environment;
};

const getAssetTypes = async (): Promise<
  Pick<AssetTypeData, "name" | "code" | "pimCode">[] | undefined
> => {
  const environment = await getSpaceEnvironment();
  if (environment) {
    const assetType = await environment.getEntries({
      content_type: "assetType"
    });

    return assetType.items
      .filter(({ fields: { name, code, pimCode } }) => name && code && pimCode)
      .map(({ fields: { name, code, pimCode } }) => ({
        name: name[`${LOCALE}`],
        code: code[`${LOCALE}`],
        pimCode: pimCode[`${LOCALE}`]
      }));
  }
};

const getProductDocumentNameMap = async (): Promise<
  ProductDocumentNameMap | undefined
> => {
  const environment = await getSpaceEnvironment();
  if (environment) {
    const resources = await environment.getEntries({
      content_type: "resources"
    });
    const productDocumentNameMap =
      resources.items[0].fields["productDocumentNameMap"];
    if (productDocumentNameMap) {
      return productDocumentNameMap[`${LOCALE}`];
    }
    return "Document name";
  }
};
export { getAssetTypes, getProductDocumentNameMap };
