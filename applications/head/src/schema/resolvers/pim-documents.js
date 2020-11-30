"use strict";

const _ = require("lodash");
const { getFormatFromFileName } = require("./utils/documents");
const {
  generateIdFromString,
  generateDigestFromData
} = require("./utils/encryption");

module.exports = {
  type: ["PIMDocument"],
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
        const assetType = _.find(assetTypes, { pimCode: asset.assetType });

        if (!assetType) {
          return;
        }

        const fieldData = {
          title: `${source.name} ${assetType.name}`,
          url: asset.url,
          assetType___NODE: assetType && assetType.id,
          fileSize: asset.fileSize,
          product___NODE: source.id,
          format: getFormatFromFileName(asset.realFileName),
          extension: asset.realFileName.split(".").pop()
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
