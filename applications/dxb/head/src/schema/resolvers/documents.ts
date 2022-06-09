// TODO: Find another place for this file.
import { PimAssetType, Product } from "../../components/types/pim";
import {
  generateDigestFromData,
  generateIdFromString
} from "../../utils/encryption";
import { Context, Node } from "./types";
import { getFormatFromFileName, isPimLinkDocument } from "./utils/documents";

export const resolveDocumentsFromProducts = async (
  assetTypes: PimAssetType[],
  { source, context }: { source: Partial<Node>; context: Context }
): Promise<Node[]> => {
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

  const { entries } = await context.nodeModel.findAll<Product>({
    query: {
      filter
    },
    type: "Products"
  });

  const products = [...entries];

  if (products.length === 0) {
    return [];
  }

  const { entries: resourceEntries } = await context.nodeModel.findAll<Node>({
    query: {
      limit: 1,
      filter: {
        site: {
          elemMatch: {
            countryCode: { eq: process.env.SPACE_MARKET_CODE }
          }
        }
      }
    },
    type: "ContentfulResources"
  });

  const resources = [...resourceEntries].shift();

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
            isLinkDocument: true,
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
          isLinkDocument: false,
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
  assetTypes: PimAssetType[],
  { context }: { context: Context }
): Promise<Node[]> => {
  const filter = {
    ...(assetTypes.length && {
      assetType: {
        id: {
          in: assetTypes.map(({ id }) => id)
        }
      }
    })
  };

  const { entries } = await context.nodeModel.findAll<Node>({
    query: {
      filter
    },
    type: "ContentfulDocument"
  });
  const documents = [...entries];
  if (!documents.length) {
    return [];
  }
  return documents;
};
