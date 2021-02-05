"use strict";

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
    }
  }
};
