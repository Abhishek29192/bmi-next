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
const SystemLayer = require("./System");
const Systems = require("./Systems");

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
  SystemLayer,
  Systems
};
