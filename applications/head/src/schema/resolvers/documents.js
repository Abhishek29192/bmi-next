"use strict";

const _ = require("lodash");
const { getFormatFromFileName } = require("./utils/documents");
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

  const documents = _.flatMap(products, (product) =>
    (product.assets || [])
      .filter((asset) => _.includes(pimAssetTypes, asset.assetType))
      .map((asset) => {
        const id = generateIdFromString(product.name + asset.name);
        const { fileSize, realFileName } = asset;

        if (!fileSize || !realFileName || !asset.assetType) {
          return;
        }

        const assetType = _.find(assetTypes, { pimCode: asset.assetType });

        const fieldData = {
          title: `${product.name} ${assetType.name}`,
          url: asset.url,
          assetType___NODE: assetType && assetType.id,
          fileSize,
          product___NODE: product.id,
          format: getFormatFromFileName(realFileName),
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
  type: ["Document"],
  async resolve(source, args, context) {
    const assetTypes =
      source.assetTypes___NODE && source.assetTypes___NODE.length
        ? await Promise.all(
            source.assetTypes___NODE.map((id) => {
              return context.nodeModel.getNodeById({
                id,
                type: "ContentfulAssetType"
              });
            })
          )
        : await context.nodeModel.getAllNodes(
            { type: "ContentfulAssetType" },
            { connectionType: "ContentfulAssetType" }
          );

    if (source.source === "PIM") {
      return resolveDocumentsFromProducts(assetTypes, {
        source,
        context
      });
    }

    if (source.source === "CMS") {
      return resolveDocumentsFromContentful(assetTypes, { context });
    }

    if (source.source === "ALL") {
      const cmsDocuments = await resolveDocumentsFromContentful(assetTypes, {
        context
      });
      const pimDocuments = await resolveDocumentsFromProducts(assetTypes, {
        source,
        context
      });

      return [...cmsDocuments, ...pimDocuments];
    }

    return [];
  }
};
