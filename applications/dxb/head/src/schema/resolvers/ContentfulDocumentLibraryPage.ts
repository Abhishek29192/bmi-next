import {
  resolveDocumentsFromProducts,
  resolveDocumentsFromContentful
} from "./documents";
import { Context, Node, ResolveArgs } from "./types";

export default {
  documents: {
    type: ["Document"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
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
        return await resolveDocumentsFromProducts(assetTypes, {
          source,
          context
        });
      }

      if (source.source === "CMS") {
        return await resolveDocumentsFromContentful(assetTypes, { context });
      }

      if (source.source === "ALL") {
        const cmsDocuments = (await resolveDocumentsFromContentful(assetTypes, {
          context
        })) as Node[];
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
