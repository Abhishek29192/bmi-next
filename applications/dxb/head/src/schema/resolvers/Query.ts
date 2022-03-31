import { PimAssetType, Product } from "../../components/types/pim";
import { getFilters, getPlpFilters } from "../../utils/filters";
import { ProductFilter } from "../../utils/product-filters";
import { resolveDocumentsFromProducts } from "./documents";
import { Context, Node, ResolveArgs } from "./types";

export default {
  allPIMDocument: {
    type: ["PIMDocument"],
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<Node[]> {
      const { entries } = await context.nodeModel.findAll<PimAssetType>(
        { query: {}, type: "ContentfulAssetType" },
        { connectionType: "ContentfulAssetType" }
      );
      const allAssetTypes = [...entries];
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

    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<ProductFilter[]> {
      const {
        pimClassificationCatalogueNamespace,
        categoryCodes,
        allowFilterBy
      } = args;

      const { entries } = await context.nodeModel.findAll<Product>({
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
      });

      const resolvedProducts = [...entries];

      if (resolvedProducts.length === 0) {
        return [];
      }

      return getPlpFilters({
        pimClassificationNamespace: pimClassificationCatalogueNamespace,
        products: resolvedProducts,
        allowedFilters: allowFilterBy
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
    async resolve(
      source: Node,
      args: ResolveArgs,
      context: Context
    ): Promise<ProductFilter[]> {
      const {
        pimClassificationCatalogueNamespace,
        categoryCodes,
        showBrandFilter
      } = args;

      const { entries } = await context.nodeModel.findAll<Product>({
        query: categoryCodes
          ? {
              filter: {
                categories: { elemMatch: { code: { in: categoryCodes } } }
              }
            }
          : {},
        type: "Products"
      });

      const resolvedProducts = [...entries];

      if (resolvedProducts.length === 0) {
        return [];
      }

      const category = (resolvedProducts[0].categories || []).find(({ code }) =>
        (categoryCodes || []).includes(code)
      );

      return getFilters(
        pimClassificationCatalogueNamespace,
        resolvedProducts,
        category,
        showBrandFilter
      );
    }
  }
};
