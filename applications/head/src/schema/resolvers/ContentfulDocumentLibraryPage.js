"use strict";

const {
  resolveDocumentsFromProducts,
  resolveDocumentsFromContentful
} = require("./documents");

module.exports = {
  documents: {
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
  }
};
