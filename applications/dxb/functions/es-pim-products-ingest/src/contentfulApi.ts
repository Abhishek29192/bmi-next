import logger from "@bmi-digital/functions-logger";
import {
  TypeAssetTypeSkeleton,
  TypeResourcesSkeleton
} from "@bmi/contentful-types";
import { getContentfulClient } from "@bmi/functions-contentful-client";
import { ContentfulAssetType, ProductDocumentNameMap } from "./types";

const MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE = 1000;

const getAssetTypes = async (
  locale: string,
  tag?: string
): Promise<ContentfulAssetType[]> => {
  // paginate and get ALL assetTypes from the environment.
  // JIRA: https://bmigroup.atlassian.net/browse/DXB-4313
  // suggests that documents can be excluded from indexing simply because
  // the no of items from returned using contenful client can be less than
  // total no of items present
  const client = getContentfulClient();
  let foundSoFar = 0;
  const generateQuery = (skip: number) => {
    return {
      content_type: "assetType",
      locale,
      ...(tag && { "metadata.tags.sys.id[all]": tag }),
      skip: skip,
      limit: MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE
    };
  };

  const assetTypes = await client.getEntries<TypeAssetTypeSkeleton>(
    generateQuery(foundSoFar)
  );

  const assetTypesToReturn = [...assetTypes.items];
  const totalAssetTypeCount = assetTypes.total;
  const limit = assetTypes.limit;
  foundSoFar = assetTypes.items.length;

  logger.info({
    message: `total asset types in contentful : ${totalAssetTypeCount}, limit:${limit}`
  });

  if (totalAssetTypeCount > limit) {
    while (foundSoFar < totalAssetTypeCount) {
      const assetTypes = await client.getEntries<TypeAssetTypeSkeleton>(
        generateQuery(foundSoFar)
      );
      if (assetTypes && assetTypes.items) {
        assetTypesToReturn.concat(assetTypes.items);
        foundSoFar = foundSoFar + assetTypes.items.length;
      }
    }
  }

  logger.info({
    message: `Total assetTypes retrieved: ${assetTypesToReturn.length}
  `
  });

  const assetTypesResult = assetTypesToReturn
    .filter(({ fields: { pimCode } }) => pimCode)
    .map(({ fields: { name, code, pimCode } }) => ({
      name,
      code,
      pimCode: pimCode!
    }));

  logger.info({
    message: `assetTypes result returned : ${JSON.stringify(assetTypesResult)}
  `
  });
  return assetTypesResult;
};

const getProductDocumentNameMap = async (
  locale: string,
  tag?: string
): Promise<ProductDocumentNameMap> => {
  const client = getContentfulClient();
  const resources = await client.getEntries<TypeResourcesSkeleton>({
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
