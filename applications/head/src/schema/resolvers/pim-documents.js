"use strict";

const _ = require("lodash");
const {
  getFormatFromFileName,
  isPimLinkDocument
} = require("./utils/documents");
const {
  generateIdFromString,
  generateDigestFromData
} = require("./utils/encryption");

module.exports = {
  type: ["ProductDocument"],
  async resolve(source, args, context) {
    const assetTypes = await context.nodeModel.getAllNodes(
      { type: "ContentfulAssetType" },
      { connectionType: "ContentfulAssetType" }
    );

    if (!source.assets || !source.assets.length) {
      return [];
    }

    return source.assets
      .map((asset) => {
        const id = generateIdFromString(source.name + asset.name);
        const { url, fileSize, realFileName, mime } = asset;
        const assetType = _.find(assetTypes, { pimCode: asset.assetType });

        if (!assetType || !url) {
          return;
        }

        if (isPimLinkDocument(asset)) {
          const fieldData = {
            title: `${source.name} ${assetType.name}`,
            url,
            assetType___NODE: assetType.id,
            product___NODE: source.id
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
          title: `${source.name} ${assetType.name}`,
          url,
          assetType___NODE: assetType.id,
          fileSize,
          product___NODE: source.id,
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
      .filter(Boolean);
  }
};
