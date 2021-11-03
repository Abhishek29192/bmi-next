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
const ContentfulSite = require("./ContentfulSite");
const ContentfulSystemConfiguratorBlock = require("./ContentfulSystemConfiguratorBlock");
const ContentfulVideo = require("./ContentfulVideo");
const ContentfulFormSection = require("./ContentfulFormSection");
const Products = require("./Products");
const ContentfulLink = require("./ContentfulLink");
const ContentfulImage = require("./ContentfulImage");
const Query = require("./Query");
const Systems = require("./Systems");

/**
 * These resolvers need to be exported at the level of the parent type. For
 * example, to have a resolver for System.SystemLayer.Field, it has to be
 * exported for SystemLayer.
 */
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
  ContentfulSite,
  ContentfulSystemConfiguratorBlock,
  ContentfulHomePage,
  ContentfulVideo,
  ContentfulFormSection,
  Products,
  ContentfulLink,
  ContentfulImage,
  Query,
  Systems: { path: Systems.path },
  SystemLayer: {
    relatedProducts: Systems.relatedProducts,
    relatedOptionalProducts: Systems.relatedOptionalProducts
  }
};
