import {
  resolveDocumentsFromProducts,
  resolveDocumentsFromContentful
} from "./documents";
import { Context, Node, ResolveArgs } from "./types";

export default {
  documents: {
    type: ["Document"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<Node[]> {
      let assetTypes = [];
      if (source.assetTypes___NODE && source.assetTypes___NODE.length) {
        assetTypes = await Promise.all(
          source.assetTypes___NODE.map((id) => {
            return context.nodeModel.getNodeById({
              id,
              type: "ContentfulAssetType"
            });
          })
        );
      } else {
        const { entries } = await context.nodeModel.findAll<Node>(
          { query: {}, type: "ContentfulAssetType" },
          { connectionType: "ContentfulAssetType" }
        );
        assetTypes = [...entries];
      }
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
