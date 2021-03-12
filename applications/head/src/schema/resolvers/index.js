"use strict";

const ContentfulDocumentLibraryPage = require("./ContentfulDocumentLibraryPage");
const {
  ContentfulDocumentLibraryPage: ContentfulDocumentLibraryPageCommon,
  ContentfulSimplePage,
  ContentfulContactUsPage,
  ContentfulTeamPage,
  ContentfulProductListerPage,
  ContentfulBrandLandingPage
} = require("./ContentfulPage");
const ContentfulHomePage = require("./ContentfulHomePage");
const ContentfulServiceLocatorSection = require("./ContentfulServiceLocatorSection");
const ContentfulVideo = require("./ContentfulVideo");
const Products = require("./Products");
const Query = require("./Query");

module.exports = {
  ContentfulDocumentLibraryPage: {
    ...ContentfulDocumentLibraryPage,
    ...ContentfulDocumentLibraryPageCommon
  },
  ContentfulSimplePage,
  ContentfulContactUsPage,
  ContentfulTeamPage,
  ContentfulProductListerPage,
  ContentfulBrandLandingPage,
  ContentfulServiceLocatorSection,
  ContentfulHomePage,
  ContentfulVideo,
  Products,
  Query
};
