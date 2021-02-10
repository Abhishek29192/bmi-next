"use strict";

const { getFilters } = require("../../utils/filters");
const {
  default: documents,
  resolveDocumentsFromProducts
} = require("./documents");
const pimDocuments = require("./pim-documents");
const brands = require("./brands");
const roofers = require("./roofers");

module.exports = {
  ContentfulDocumentLibraryPage: {
    documents
  },
  Products: {
    documents: pimDocuments
  },
  ContentfulHomePage: {
    slug: {
      resolve() {
        return "/";
      }
    },
    brands
  },
  ContentfulServiceLocatorSection: {
    roofers
  },
  Query: {
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
        categoryCode: "String"
      },
      async resolve(source, args, context) {
        const { pimClassificationCatalogueNamespace, categoryCode } = args;

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

        if (!products) {
          return [];
        }

        const category =
          categoryCode &&
          (await context.nodeModel.runQuery({
            query: {
              code: {
                eq: categoryCode
              }
            },
            type: "ProductCategory"
          }));

        return getFilters(
          pimClassificationCatalogueNamespace,
          products,
          category
        );
      }
    }
  }
};
