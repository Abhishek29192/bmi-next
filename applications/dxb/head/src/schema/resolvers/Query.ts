import { Product } from "@bmi/firestore-types";
import { PLPFilterResponse } from "../../types/pim";
import { ContentfulAssetType } from "./types/Contentful";
import { Context, MicroCopy, Node, ResolveArgs } from "./types/Gatsby";
import { ProductDocument } from "./types/pim";
import { resolveDocumentsFromProducts } from "./utils/documents";
import { getPlpFilters } from "./utils/filters";

export default {
  allPIMDocument: {
    type: ["PIMDocument"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<ProductDocument[]> {
      const { entries } = await context.nodeModel.findAll<ContentfulAssetType>(
        { query: {}, type: "ContentfulAssetType" },
        { connectionType: "ContentfulAssetType" }
      );
      const allAssetTypes = [...entries];
      const result = await resolveDocumentsFromProducts(
        allAssetTypes,
        {
          source: {},
          context
        },
        null
      );
      return result.documents;
    }
  },
  plpFilters: {
    type: "PLPFilterResponse",
    args: {
      categoryCodes: "[String!]",
      allowFilterBy: "[String!]"
    },
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<PLPFilterResponse> {
      const { categoryCodes, allowFilterBy } = args;

      const { entries } = await context.nodeModel.findAll<Product>({
        query: categoryCodes
          ? {
              filter: {
                categories: { elemMatch: { code: { in: categoryCodes } } }
              }
            }
          : {},
        type: "Product"
      });

      const resolvedProducts = [...entries];

      if (resolvedProducts.length === 0) {
        return { filters: [], allowFilterBy: allowFilterBy };
      }

      const pageCategory = (resolvedProducts[0].categories || []).find(
        ({ code }) => (categoryCodes || []).includes(code)
      );

      let allowFilterByLocal = allowFilterBy || [];
      //TODO: Remove feature flag 'GATSBY_USE_LEGACY_FILTERS' branch code
      // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
      if (process.env.GATSBY_USE_LEGACY_FILTERS === "true") {
        allowFilterByLocal = [];

        allowFilterByLocal.push("Brand");

        if (pageCategory) {
          if (pageCategory.categoryType !== "ProductFamily") {
            allowFilterByLocal.push("ProductFamily");
          }
          if (pageCategory.categoryType !== "ProductLine") {
            allowFilterByLocal.push("ProductLine");
          }
        }
        allowFilterByLocal.push("appearanceAttributes.colourFamily");
        allowFilterByLocal.push("generalInformation.materials");
        //couldnt see this in Elastic search response..hence all the options are disabled on the UI!
        allowFilterByLocal.push("appearanceAttributes.textureFamily");
        // If you are not on a category product listing page, then show category filters!
        // if `pageCategory` is specified, then check its category type too!
        // This is done afterwards to ensure the category specific filters are after the others.
        if (pageCategory && pageCategory.categoryType !== "Category") {
          const categoryGroupCodes = Array.from(
            new Set(
              resolvedProducts
                .flatMap((product) =>
                  (product.groups || []).flatMap((group) => group)
                )
                .sort((a, b) => {
                  if (a.label > b.label) {
                    return 1;
                  }
                  if (a.label < b.label) {
                    return -1;
                  }
                  return 0;
                })
                .map((group) => group.code)
                .filter((categoryCode) => categoryCode.length > 0)
            )
          );
          if (categoryGroupCodes && categoryGroupCodes.length) {
            categoryGroupCodes.forEach((categoryCode) =>
              allowFilterByLocal.push(`${categoryCode}`)
            );
          }
        }
      } else {
        // added this part of building category filter here again ( see similar code above )
        // for simplicity, of, when we want to remove `LEGACY_FILTERS` code!
        // If you are not on a category product listing page, then show category filters!
        // if `pageCategory` is specified, then check its category type too!
        if (
          !pageCategory ||
          (pageCategory && pageCategory.categoryType !== "Category")
        ) {
          const categoryGroupCodes = Array.from(
            new Set(
              resolvedProducts
                .flatMap((product) =>
                  (product.groups || []).flatMap((group) => group)
                )
                .sort((a, b) => {
                  if (a.label > b.label) {
                    return 1;
                  }
                  if (a.label < b.label) {
                    return -1;
                  }
                  return 0;
                })
                .map((group) => group.code)
                .filter((categoryCode) => categoryCode.length > 0)
            )
          );
          if (categoryGroupCodes && categoryGroupCodes.length) {
            categoryGroupCodes.forEach((categoryCode) =>
              allowFilterByLocal.push(`${categoryCode}`)
            );
          }
        }
      }

      const { entries: resourceEntries } =
        await context.nodeModel.findAll<MicroCopy>(
          {
            query: {},
            type: "ContentfulMicroCopy"
          },
          { connectionType: "ContentfulMicroCopy" }
        );
      const filterMicroCopies: Map<string, string> = [
        ...resourceEntries
      ].reduce((map, microCopy) => {
        return map.set(microCopy.key, microCopy.value);
      }, new Map());

      const productFilters = getPlpFilters({
        products: resolvedProducts,
        allowedFilters: allowFilterByLocal,
        microCopies: filterMicroCopies
      });

      return {
        filters: productFilters,
        allowFilterBy: allowFilterByLocal
      };
    }
  }
};
