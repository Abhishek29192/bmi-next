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
      categoryCodes: "[String]",
      showBrandFilter: "Boolean"
    },
    async resolve(source, args, context) {
      const {
        pimClassificationCatalogueNamespace,
        categoryCodes,
        showBrandFilter
      } = args;

      const products = await context.nodeModel.runQuery({
        query: categoryCodes
          ? {
              filter: {
                categories: { elemMatch: { code: { in: categoryCodes } } }
              }
            }
          : {},
        type: "Products"
      });

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
