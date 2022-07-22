import { ProductFilter } from "../../types/pim";
import {
  ContentfulAssetType,
  ContentfulDocumentLibraryPage
} from "./types/Contentful";
import { DocumentsWithFilters } from "./types/DocumentsWithFilters";
import { Context, Node, ResolveArgs } from "./types/Gatsby";
import {
  sortAllDocuments,
  sortCmsDocuments,
  sortPimDocuments
} from "./utils/documentLibrarySort";
import {
  resolveDocumentsFromContentful,
  resolveDocumentsFromProducts
} from "./utils/documents";

const getDocumentsWithFilters = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<DocumentsWithFilters> => {
  if (source.source === "PIM") {
    let allowFilterBy = (source.allowFilterBy || []) as string[];
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

    const pimDocuments = await resolveDocumentsFromProducts(
      assetTypes,
      {
        source,
        context
      },
      allowFilterBy
    );
    return {
      filters: pimDocuments.filters,
      documents: sortPimDocuments(pimDocuments.documents)
    };
  }

  if (source.source === "CMS") {
    let allowFilterBy: string[];
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

    return {
      filters: cmsDocuments.filters,
      documents: sortCmsDocuments(cmsDocuments.documents)
    };
  }

  if (source.source === "ALL") {
    let allowFilterBy = (source.allowFilterBy || []) as string[];

    if (source.resultsType !== "Simple") {
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
    const allFilters = [...pimDocuments.filters, ...cmsDocuments.filters];
    const mergedFilters = allFilters.reduce<ProductFilter[]>(
      (allFilters, currFilter) => {
        const existingFilter = allFilters.find(
          (filter) => filter.filterCode === currFilter.filterCode
        );
        if (existingFilter) {
          currFilter.options.forEach((currOption) => {
            const matchingOption = existingFilter.options.find(
              (option) =>
                option.label === currOption.label &&
                option.value === currOption.value
            );
            if (!matchingOption) {
              existingFilter.options.push(currOption);
            }
          });
        } else {
          allFilters.push(currFilter);
        }
        return allFilters;
      },
      [] as ProductFilter[]
    );
    return {
      filters: mergedFilters,
      documents: sortAllDocuments(allDocs, assetTypes)
    };
  }

  return { filters: [], documents: [] };
};

export default {
  documentsWithFilters: {
    type: "DocumentsWithFiltersResponse",
    async resolve(
      source: ContentfulDocumentLibraryPage,
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
        assetTypes = entries ? [...entries] : [];
      }

      return await getDocumentsWithFilters(source, context, assetTypes);
    }
  }
};
