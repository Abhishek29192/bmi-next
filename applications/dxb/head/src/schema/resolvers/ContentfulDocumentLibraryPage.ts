import { AssetType } from "../../templates/documentLibrary/types";
import { ProductFilter } from "../../types/pim";
import {
  ContentfulAssetType,
  ContentfulDocumentLibraryPage
} from "./types/Contentful";
import { DocumentsFilters } from "./types/DocumentsFilters";
import { Context, Node, ResolveArgs } from "./types/Gatsby";
import {
  resolveDocumentsFiltersFromContentful,
  resolveDocumentsFiltersFromProducts
} from "./utils/documents";
import { transformFilterKeys } from "./utils/filters";

const getProductDocumentsFilters = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<ProductFilter[]> => {
  if (source.source === "PIM" || source.source === "ALL") {
    let allowFilterBy = transformFilterKeys(source.allowFilterBy || []);
    switch (source.resultsType) {
      case "Simple":
        allowFilterBy = [
          "AssetType",
          "Brand",
          "ProductFamily",
          "appearanceAttributes$texturefamily",
          ...allowFilterBy
        ];
        break;
      case "Technical":
        allowFilterBy = ["Brand", "ProductFamily", ...allowFilterBy];
        break;
      default:
        allowFilterBy = ["Brand"];
    }

    const filters = await resolveDocumentsFiltersFromProducts(
      assetTypes,
      {
        source,
        context
      },
      allowFilterBy
    );
    return filters;
  }
  return [];
};

const getContentfulDocumentsFilters = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<ProductFilter[]> => {
  if (source.source === "CMS" || source.source === "ALL") {
    let allowFilterBy: string[];
    switch (source.resultsType) {
      case "Simple":
        allowFilterBy = ["AssetType", "Brand"];
        break;
      default:
        allowFilterBy = ["Brand"];
    }
    return await resolveDocumentsFiltersFromContentful(
      assetTypes,
      { source, context },
      allowFilterBy
    );
  }
  return [];
};

const getDocumentsFilters = async (
  source: ContentfulDocumentLibraryPage,
  context: Context,
  assetTypes: ContentfulAssetType[]
): Promise<DocumentsFilters> => {
  const pimDocumentsFilters = await getProductDocumentsFilters(
    source,
    context,
    assetTypes
  );

  if (source.source === "PIM") {
    return {
      filters: pimDocumentsFilters
    };
  }

  const cmsDocumentsFilters = await getContentfulDocumentsFilters(
    source,
    context,
    assetTypes
  );

  if (source.source === "CMS") {
    return {
      filters: cmsDocumentsFilters
    };
  }

  const allFilters = [...pimDocumentsFilters, ...cmsDocumentsFilters];
  const mergedFilters = allFilters
    .reduce<ProductFilter[]>((allFilters, currFilter) => {
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
    }, [] as ProductFilter[])
    .map((filter) => ({
      ...filter,
      options: filter.options.sort((a, b) => (a.label > b.label ? 1 : -1))
    }));
  return {
    filters: mergedFilters
  };
};

export default {
  contentfulAssetTypes: {
    type: "[AssetType]!",
    async resolve(
      source: ContentfulDocumentLibraryPage,
      args: ResolveArgs,
      context: Context
    ): Promise<AssetType[]> {
      let assetTypes: ContentfulAssetType[];
      if (source.assetTypes___NODE && source.assetTypes___NODE.length) {
        assetTypes = await Promise.all(
          source.assetTypes___NODE.map(async (id) => {
            return (await context.nodeModel.getNodeById({
              id,
              type: "ContentfulAssetType"
            })) as ContentfulAssetType;
          })
        );
      } else {
        const marketFilters = process.env.MARKET_TAG_NAME
          ? {
              metadata: {
                tags: {
                  elemMatch: {
                    contentful_id: {
                      eq: process.env.MARKET_TAG_NAME
                    }
                  }
                }
              }
            }
          : {};
        const { entries } =
          await context.nodeModel.findAll<ContentfulAssetType>(
            { query: { filter: marketFilters }, type: "ContentfulAssetType" },
            { connectionType: "ContentfulAssetType" }
          );
        assetTypes = entries ? [...entries] : [];
      }

      return assetTypes.map((assetType) => ({
        name: assetType.name,
        code: assetType.code,
        description: assetType.description,
        pimCode: assetType.pimCode
      }));
    }
  },
  documentsFilters: {
    type: "DocumentsFiltersResponse",
    async resolve(
      source: ContentfulDocumentLibraryPage,
      args: ResolveArgs,
      context: Context
    ): Promise<DocumentsFilters> {
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
        const marketFilters = process.env.MARKET_TAG_NAME
          ? {
              metadata: {
                tags: {
                  elemMatch: {
                    contentful_id: {
                      eq: process.env.MARKET_TAG_NAME
                    }
                  }
                }
              }
            }
          : {};
        const { entries } = await context.nodeModel.findAll<Node>(
          { query: { filter: marketFilters }, type: "ContentfulAssetType" },
          { connectionType: "ContentfulAssetType" }
        );
        assetTypes = entries ? [...entries] : [];
      }

      return await getDocumentsFilters(source, context, assetTypes);
    }
  }
};
