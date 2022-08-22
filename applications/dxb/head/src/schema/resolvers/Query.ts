import { Product } from "@bmi/firestore-types";
import { FourOFourResponse, PLPFilterResponse } from "../../types/pim";
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

      const { entries } = await context.nodeModel.findAll<Product>({
        query: categoryCodes
          ? {
              filter: {
                categories: {
                  elemMatch: { code: { in: categoryCodes } },
                  ...marketFilters
                }
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
              allowFilterByLocal.push(`Category | ${categoryCode}`)
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
  },
  // Creates static set of filters regardless of market. When we move to having
  // customisable filters for search, this should be inline with how PLPs are
  // handled, and therefore use the plpFilters resolver.
  searchFilters: {
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
      const { categoryCodes } = args;

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

      const allowFilterBy = [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ];

      if (resolvedProducts.length === 0) {
        return { filters: [], allowFilterBy: allowFilterBy };
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
        allowedFilters: allowFilterBy,
        microCopies: filterMicroCopies
      });

      return {
        filters: productFilters,
        allowFilterBy: allowFilterBy
      };
    }
  },
  FourOFour: {
    type: "FourOFourResponse",
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<FourOFourResponse> {
      const marketCode = process.env.SPACE_MARKET_CODE;
      const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;

      const { entries } = await context.nodeModel.findAll<Node>(
        {
          query: {
            filter: {
              countryCode: { eq: marketCode },
              node_locale: { eq: localeCode }
            }
          },
          type: "ContentfulSite"
        },
        { connectionType: "ContentfulSite" }
      );
      const siteData = [...entries];

      if (siteData.length === 0) {
        // eslint-disable-next-line no-console
        console.warn(
          `Site not found: for country code: '${marketCode}' and locale: '${localeCode}'.`
        );
        return { errorPageData: undefined, siteData: undefined };
      }
      const resource = await context.nodeModel.getNodeById({
        id: siteData[0].resources___NODE as string,
        type: "ContentfulResources"
      });
      const currSite = siteData[0];
      if (!resource) {
        // eslint-disable-next-line no-console
        console.warn(`Resource not found: for site id: '${currSite.id}'.`);
        return { errorPageData: undefined, siteData: currSite };
      }
      const errorFourOFour = await context.nodeModel.getNodeById({
        id: resource.errorFourOFour___NODE as string,
        type: "ContentfulPromo"
      });
      if (!errorFourOFour) {
        // eslint-disable-next-line no-console
        console.warn(
          `Resource 'errorFourOFour' not found: at resource id: '${resource.id}'.`
        );
        return { errorPageData: undefined, siteData: currSite };
      }
      return { errorPageData: errorFourOFour, siteData: currSite };
    }
  }
};
