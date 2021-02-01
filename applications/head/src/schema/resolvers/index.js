"use strict";

const documents = require("./documents");
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
  }
};
