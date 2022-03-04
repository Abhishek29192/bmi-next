import { Product } from "../../components/types/pim";
import { getFilters, getPlpFilters } from "../../utils/filters";
import { resolveDocumentsFromProducts } from "./documents";
import { Context, Node, ResolveArgs } from "./types";

export default {
  allPIMDocument: {
    type: ["PIMDocument"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const allAssetTypes = await context.nodeModel.getAllNodes(
        { type: "ContentfulAssetType" },
        { connectionType: "ContentfulAssetType" }
      );
      return resolveDocumentsFromProducts(allAssetTypes, {
        source: {},
        context
      });
    }
  },
  plpFilters: {
    type: ["Filter"],
    args: {
      pimClassificationCatalogueNamespace: "String!",
      categoryCodes: "[String!]",
      showBrandFilter: "Boolean",
      allowFilterBy: "[String!]"
    },
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const {
        pimClassificationCatalogueNamespace,
        categoryCodes,
        allowFilterBy
      } = args;
      const products = (await context.nodeModel.findAll({
        query: categoryCodes
          ? {
              filter: {
                categories: { elemMatch: { code: { in: categoryCodes } } },
                approvalStatus: { eq: "approved" },
                variantOptions: {
                  elemMatch: { approvalStatus: { eq: "approved" } }
                }
              }
            }
          : {},
        type: "Products"
      })) as Product[];

      if (!products.length) {
        return [];
      }

      const pageCategory = (products[0].categories || []).find(({ code }) =>
        (categoryCodes || []).includes(code)
      );

      return getPlpFilters({
        pimClassificationNamespace: pimClassificationCatalogueNamespace,
        products,
        allowedFilters: allowFilterBy,
        pageCategory
      });
    }
  },
  // Filters available on the page, resolved from products related to the page's product category.
  productFilters: {
    type: ["Filter"],
    args: {
      pimClassificationCatalogueNamespace: "String!",
      categoryCodes: "[String!]",
      showBrandFilter: "Boolean"
    },
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      const {
        pimClassificationCatalogueNamespace,
        categoryCodes,
        showBrandFilter
      } = args;

      const products = (await context.nodeModel.findAll({
        query: categoryCodes
          ? {
              filter: {
                categories: { elemMatch: { code: { in: categoryCodes } } }
              }
            }
          : {},
        type: "Products"
      })) as Product[];

      if (!products.length) {
        return [];
      }

      const category = (products[0].categories || []).find(({ code }) =>
        (categoryCodes || []).includes(code)
      );

      return getFilters(
        pimClassificationCatalogueNamespace,
        products,
        category,
        showBrandFilter
      );
    }
  }
};
