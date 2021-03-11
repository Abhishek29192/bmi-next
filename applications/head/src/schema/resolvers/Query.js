"use strict";

const { getFilters } = require("../../utils/filters");
const { resolveDocumentsFromProducts } = require("./documents");

module.exports = {
  allPIMDocument: {
    type: ["PIMDocument"],
    async resolve(source, args, context) {
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
  // Filters available on the page, resolved from products related to the page's product category.
  productFilters: {
    type: ["Filter"],
    args: {
      pimClassificationCatalogueNamespace: "String!",
      categoryCode: "String",
      showBrandFilter: "Boolean"
    },
    async resolve(source, args, context) {
      const {
        pimClassificationCatalogueNamespace,
        categoryCode,
        showBrandFilter
      } = args;

      const products = await context.nodeModel.runQuery({
        query: categoryCode
          ? {
              filter: {
                categories: { elemMatch: { code: { eq: categoryCode } } }
              }
            }
          : {},
        type: "Products"
      });

      if (!(products && products.length)) {
        return [];
      }

      const category =
        categoryCode &&
        (await context.nodeModel.runQuery({
          query: {
            filter: {
              code: {
                eq: categoryCode
              }
            }
          },
          type: "ProductCategory",
          firstOnly: true
        }));

      return getFilters(
        pimClassificationCatalogueNamespace,
        products,
        category,
        showBrandFilter
      );
    }
  }
};
