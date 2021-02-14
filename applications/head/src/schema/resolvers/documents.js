// TODO: Find another place for this file.
"use strict";

const { flatMap, includes, find } = require("lodash");
const {
  getFormatFromFileName,
  isPimLinkDocument
} = require("./utils/documents");
const {
  generateIdFromString,
  generateDigestFromData
} = require("./utils/encryption");

const resolveDocumentsFromProducts = async (
  assetTypes,
  { source, context }
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
          : {})
      }
    : {};

  const products = await context.nodeModel.runQuery({
    query: {
      filter
    },
    type: "Products"
  });

  if (!products) {
    return [];
  }

  const documents = flatMap(products, (product) =>
    (product.assets || [])
      .filter((asset) => includes(pimAssetTypes, asset.assetType))
      .map((asset) => {
        const id = generateIdFromString(product.name + asset.name);
        const { url, fileSize, realFileName, mime } = asset;
        const assetType = find(assetTypes, { pimCode: asset.assetType });

        if (!assetType || !url) {
          return;
        }

        if (isPimLinkDocument(asset)) {
          const fieldData = {
            title: `${product.name} ${assetType.name}`,
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
          title: `${product.name} ${assetType.name}`,
          url,
          assetType___NODE: assetType.id,
          fileSize,
          product___NODE: product.id,
          format: mime || getFormatFromFileName(realFileName),
          extension: realFileName.split(".").pop()
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

  return documents || [];
};

const resolveDocumentsFromContentful = async (assetTypes, { context }) => {
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

  return documents || [];
};

module.exports = {
  resolveDocumentsFromProducts,
  resolveDocumentsFromContentful
};
