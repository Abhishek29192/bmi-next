// TODO: Find another place for this file.
import {
  generateIdFromString,
  generateDigestFromData
} from "../../utils/encryption";
import { Node, Context } from "./types";
import { getFormatFromFileName, isPimLinkDocument } from "./utils/documents";

export const resolveDocumentsFromProducts = async (
  assetTypes,
  { source, context }: { source: Partial<Node>; context: Context }
) => {
  const pimAssetTypes = assetTypes.map(({ pimCode }) => pimCode);
  const filter = assetTypes.length
    ? {
        assets: {
          elemMatch: {
            assetType: {
              in: pimAssetTypes
            }
          }
        },
        ...(source.pimCodes && source.pimCodes.length
          ? {
              code: {
                in: source.pimCodes
              }
            }
          : {}),
        ...(source.categoryCodes && source.categoryCodes.length
          ? {
              categories: { elemMatch: { code: { in: source.categoryCodes } } }
            }
          : {})
      }
    : {};

  const products = (await context.nodeModel.runQuery({
    query: {
      filter
    },
    type: "Products"
  })) as Node[];

  if (!products.length) {
    return [];
  }

  const resources = (await context.nodeModel.runQuery({
    query: {
      filter: {
        site: {
          elemMatch: {
            countryCode: { eq: process.env.SPACE_MARKET_CODE }
          }
        }
      }
    },
    type: "ContentfulResources",
    firstOnly: true
  })) as Node;

  const documents = products.flatMap((product) =>
    (product.assets || [])
      .filter((asset) => pimAssetTypes.includes(asset.assetType))
      .map((asset) => {
        const id = generateIdFromString(product.name + asset.name, true);
        const { url, fileSize, realFileName, mime, name } = asset;
        const assetType = assetTypes.find(
          (assetType) => assetType.pimCode === asset.assetType
        );

        if (!assetType || !url) {
          return;
        }

        const title = {
          "Product name + asset type": `${product.name} ${assetType.name}`,
          "Document name": name || `${product.name} ${assetType.name}`
        }[(resources && resources.productDocumentNameMap) || "Document name"];

        if (isPimLinkDocument(asset)) {
          const fieldData = {
            title,
            url,
            assetType___NODE: assetType.id,
            product___NODE: product.id
          };

          return {
            id,
            ...fieldData,
            parent: source.id,
            children: [],
            internal: {
              type: "PIMLinkDocument",
              owner: "@bmi/resolvers",
              contentDigest: generateDigestFromData(fieldData)
            }
          };
        }

        if (!fileSize || !realFileName) {
          return;
        }

        const fieldData = {
          title,
          url,
          assetType___NODE: assetType.id,
          fileSize,
          product___NODE: product.id,
          format: mime || getFormatFromFileName(realFileName),
          extension: realFileName.split(".").pop(),
          realFileName: realFileName
        };

        return {
          id,
          ...fieldData,
          parent: source.id,
          children: [],
          internal: {
            type: "PIMDocument",
            owner: "@bmi/resolvers",
            contentDigest: generateDigestFromData(fieldData)
          }
        };
      })
      .filter(Boolean)
  );

  return documents;
};

export const resolveDocumentsFromContentful = async (
  assetTypes,
  { context }: { context: Context }
) => {
  const filter = assetTypes.length
    ? {
        assetType: {
          id: {
            in: assetTypes.map(({ id }) => id)
          }
        }
      }
    : {};

  const documents = await context.nodeModel.runQuery({
    query: {
      filter
    },
    type: "ContentfulDocument"
  });

  return documents;
};