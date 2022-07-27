import { ProductFilter } from "../../types/pim";
import {
  ContentfulAssetType,
  ContentfulDocumentLibraryPage
} from "./types/Contentful";
import {
  ContentfulDocumentsWithFilters,
  DocumentsWithFilters,
  ProductDocumentsWithFilters
} from "./types/DocumentsWithFilters";
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

const getProductDocuments = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<ProductDocumentsWithFilters> => {
  if (source.source === "PIM" || source.source === "ALL") {
    let allowFilterBy = (source.allowFilterBy || []) as string[];
    switch (source.resultsType) {
      case "Simple":
        allowFilterBy = [
          "AssetType",
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
        allowFilterBy = ["Brand"];
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
      documents: pimDocuments.documents
    };
  }
  return {
    filters: [],
    documents: []
  };
};

const getContentfulDocuments = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<ContentfulDocumentsWithFilters> => {
  if (source.source === "CMS" || source.source === "ALL") {
    let allowFilterBy: string[];
    switch (source.resultsType) {
      case "Simple":
        allowFilterBy = ["AssetType", "Brand"];
        break;
      default:
        allowFilterBy = ["Brand"];
    }
    const cmsDocuments = await resolveDocumentsFromContentful(
      assetTypes,
      { source, context },
      allowFilterBy
    );

    return {
      filters: cmsDocuments.filters,
      documents: cmsDocuments.documents
    };
  }
  return {
    filters: [],
    documents: []
  };
};

const getDocumentsWithFilters = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<DocumentsWithFilters> => {
  const pimDocumentsWithFilters = await getProductDocuments(
    source,
    context,
    assetTypes
  );

  if (source.source === "PIM") {
    return {
      filters: pimDocumentsWithFilters.filters,
      documents: sortPimDocuments(pimDocumentsWithFilters.documents)
    };
  }

  const cmsDocumentsWithFilters = await getContentfulDocuments(
    source,
    context,
    assetTypes
  );

  if (source.source === "CMS") {
    return {
      filters: cmsDocumentsWithFilters.filters,
      documents: sortCmsDocuments(cmsDocumentsWithFilters.documents)
    };
  }

  const allDocs = [
    ...cmsDocumentsWithFilters.documents,
    ...pimDocumentsWithFilters.documents
  ];

  const allFilters = [
    ...pimDocumentsWithFilters.filters,
    ...cmsDocumentsWithFilters.filters
  ];
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
