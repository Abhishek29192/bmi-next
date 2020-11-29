"use strict";

const crypto = require("crypto");
const _ = require("lodash");
const MurmurHash3 = require("imurmurhash");
const path = require("path");

const mapExtensionToFormat = {
  pdf: "application/pdf",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  png: "image/png"
};

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
        }
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
        const id = MurmurHash3(
          product.name + asset.name + new Date().getTime().toString
        )
          .result()
          .toString();
        const assetType = _.find(assetTypes, { pimCode: asset.assetType });

        const fieldData = {
          title: `${product.name} ${assetType.name}`,
          url: asset.url,
          assetType___NODE: assetType && assetType.id,
          fileSize: asset.fileSize,
          product___NODE: product.id,
          format:
            mapExtensionToFormat[path.extname(asset.realFileName).substr(1)]
        };

        return {
          id,
          ...fieldData,
          parent: source.id,
          children: [],
          internal: {
            type: "PIMDocument",
            owner: "@bmi/resolvers",
            contentDigest: crypto
              .createHash("md5")
              .update(JSON.stringify(fieldData))
              .digest("hex")
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
    const assetTypes = await Promise.all(
      (source.assetTypes___NODE || []).map((id) => {
        return context.nodeModel.getNodeById({
          id,
          type: "ContentfulAssetType"
        });
      })
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
