"use strict";

const documents = require("./documents");
const pimDocuments = require("./pim-documents");
const brands = require("./brands");

module.exports = {
  ContentfulDocumentLibraryPage: {
    documents
  },
  Products: {
    documents: pimDocuments
  },
  ContentfulHomePage: {
    brands
  }
};
