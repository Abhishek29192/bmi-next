import { DocumentsWithFilters } from "../../types/documentsWithFilters";
import { Context, Node, ResolveArgs } from "./types/Gatsby";
import {
  resolveDocumentsFromContentful,
  resolveDocumentsFromProducts
} from "./utils/documents";

export default {
  documentsWithFilters: {
    type: "DocumentsWithFiltersResponse",
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<DocumentsWithFilters> {
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
        let allowFilterBy = source.allowFilterBy as string[];

        switch (source.resultsType) {
          case "Simple":
            allowFilterBy = [
              "Brand",
              "ProductFamily",
              "appearanceAttributes.texturefamily",
              ...allowFilterBy
            ];
            break;
          case "Technical":
            allowFilterBy = ["Brand", "ProductFamily", ...allowFilterBy];
            break;
          default:
            allowFilterBy = [];
        }

        const pimDouments = await resolveDocumentsFromProducts(
          assetTypes,
          {
            source,
            context
          },
          allowFilterBy
        );
        return {
          filters: pimDouments.filters.filter(Boolean),
          documents: pimDouments.documents
        };
      }

      if (source.source === "CMS") {
        let allowFilterBy = source.allowFilterBy as string[];
        switch (source.resultsType) {
          case "Card Collection":
            allowFilterBy = ["Brand"];
            break;
          case "Simple":
            allowFilterBy = ["Brand", "AssetType"];
            break;
          default:
            allowFilterBy = [];
        }
        const cmsDocuments = await resolveDocumentsFromContentful(
          assetTypes,
          { source, context },
          allowFilterBy
        );

        return cmsDocuments;
      }

      if (source.source === "ALL") {
        let allowFilterBy = source.allowFilterBy as string[];

        switch (source.resultsType) {
          case "Simple":
            allowFilterBy = [...allowFilterBy];
            break;
          default:
            allowFilterBy = [];
        }

        const cmsDocuments = await resolveDocumentsFromContentful(
          assetTypes,
          {
            source,
            context
          },
          ["Brand", "AssetType"]
        );
        const pimDocuments = await resolveDocumentsFromProducts(
          assetTypes,
          {
            source,
            context
          },
          allowFilterBy
        );

        const allDocs = [...cmsDocuments.documents, ...pimDocuments.documents];

        //TODO: merge "Brand" filter and de-duplicate its options
        // currently in PROD no duplication is done for Brand filters
        const allFilters = [
          ...(pimDocuments.filters || []),
          ...(cmsDocuments.filters || [])
        ];

        return {
          filters: allFilters,
          documents: allDocs
        };
      }

      return { filters: [], documents: [] };
    }
  }
};
