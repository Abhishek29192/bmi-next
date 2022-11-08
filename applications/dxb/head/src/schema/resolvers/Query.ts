import { Product } from "@bmi/firestore-types";
import { PLPFilterResponse } from "../../types/pim";
import {
  ContentfulPromoCard,
  ContentfulSite,
  FourOFourResponse
} from "./types/Contentful";
import { Context, Node, ResolveArgs } from "./types/Gatsby";
import { getPlpFilters } from "./utils/filters";

export default {
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
                categories: {
                  elemMatch: { code: { in: categoryCodes } }
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

      const marketCode = process.env.SPACE_MARKET_CODE;
      const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;
      if (!marketCode || !localeCode) {
        // eslint-disable-next-line no-console
        console.warn(
          `Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!`
        );
        return { filters: [], allowFilterBy: allowFilterBy };
      }
      const currSite = await context.nodeModel.findOne<ContentfulSite>(
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
      if (!currSite) {
        // eslint-disable-next-line no-console
        console.warn(
          `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
        );
        return { filters: [], allowFilterBy: allowFilterBy };
      }
      const resource = await context.nodeModel.getNodeById({
        id: currSite.resources___NODE as string,
        type: "ContentfulResources"
      });
      if (!resource) {
        // eslint-disable-next-line no-console
        console.warn(
          `Resource not found: for site in contentful with id: '${currSite.contentful_id}'.`
        );
        return { filters: [], allowFilterBy: allowFilterBy };
      }

      // MC access in consistently happens only via resource content type
      // that means a market is only aware of MCs which are associated with the resource
      const microCopies = await context.nodeModel.getNodesByIds({
        ids: resource.microCopy___NODE,
        type: "ContentfulMicroCopy"
      });

      const filterMicroCopies: Map<string, string> = microCopies.reduce(
        (map, microCopy) => {
          return map.set(microCopy.key, microCopy.value);
        },
        new Map()
      );

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

      const marketCode = process.env.SPACE_MARKET_CODE;
      const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;
      if (!marketCode || !localeCode) {
        // eslint-disable-next-line no-console
        console.warn(
          `Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!`
        );
        return { filters: [], allowFilterBy: allowFilterBy };
      }
      const currSite = await context.nodeModel.findOne<ContentfulSite>(
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
      if (!currSite) {
        // eslint-disable-next-line no-console
        console.warn(
          `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
        );
        return { filters: [], allowFilterBy: allowFilterBy };
      }
      const resource = await context.nodeModel.getNodeById({
        id: currSite.resources___NODE as string,
        type: "ContentfulResources"
      });
      if (!resource) {
        // eslint-disable-next-line no-console
        console.warn(
          `Resource not found: for site in contentful with id: '${currSite.contentful_id}'.`
        );
        return { filters: [], allowFilterBy: allowFilterBy };
      }

      // MC access in consistently happens only via resource content type
      // that means a market is only aware of MCs which are associated with the resource
      const microCopies = await context.nodeModel.getNodesByIds({
        ids: resource.microCopy___NODE,
        type: "ContentfulMicroCopy"
      });

      const filterMicroCopies: Map<string, string> = microCopies.reduce(
        (map, microCopy) => {
          return map.set(microCopy.key, microCopy.value);
        },
        new Map()
      );

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
  fourOFour: {
    type: "FourOFourResponse",
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<FourOFourResponse> {
      const marketCode = process.env.SPACE_MARKET_CODE;
      const localeCode = process.env.GATSBY_MARKET_LOCALE_CODE;
      if (!marketCode || !localeCode) {
        // eslint-disable-next-line no-console
        console.warn(
          `Please check enviroment variables 'SPACE_MARKET_CODE' or 'GATSBY_MARKET_LOCALE_CODE' not set!`
        );
        return { errorPageData: undefined, siteData: undefined };
      }
      const currSite = await context.nodeModel.findOne<ContentfulSite>(
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
      if (!currSite) {
        // eslint-disable-next-line no-console
        console.warn(
          `Site not found in contentful: for country code: '${marketCode}' and locale: '${localeCode}'.`
        );
        return { errorPageData: undefined, siteData: undefined };
      }
      const resource = await context.nodeModel.getNodeById({
        id: currSite.resources___NODE as string,
        type: "ContentfulResources"
      });
      if (!resource) {
        // eslint-disable-next-line no-console
        console.warn(
          `Resource not found: for site in contentful with id: '${currSite.contentful_id}'.`
        );
        return {
          errorPageData: undefined,
          siteData: currSite
        };
      }
      const errorFourOFour = await context.nodeModel.getNodeById({
        id: resource.errorFourOFour___NODE as string,
        type: "ContentfulPromo"
      });
      if (!errorFourOFour) {
        // eslint-disable-next-line no-console
        console.warn(
          `'errorFourOFour' not found on resource in contentful with id: '${resource.contentful_id}'.`
        );
        return {
          errorPageData: undefined,
          siteData: currSite
        };
      }

      return {
        errorPageData: errorFourOFour as ContentfulPromoCard,
        siteData: currSite
      };
    }
  }
};
