"use strict";

const documents = require("./documents");
const pimDocuments = require("./pim-documents");

module.exports = {
  ContentfulDocumentLibraryPage: {
    documents
  },
  Products: {
    documents: pimDocuments
  }
};
