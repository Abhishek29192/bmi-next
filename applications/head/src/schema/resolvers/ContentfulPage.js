"use strict";

const { resolvePath, getUrlFromPath } = require("./utils/path");

const pages = [
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
  "ContentfulTeamPage",
  "ContentfulProductListerPage",
  "ContentfulDocumentLibraryPage",
  "ContentfulBrandLandingPage"
];

module.exports = pages.reduce(
  (resolvers, pageName) => ({
    ...resolvers,
    [pageName]: {
      path: {
        async resolve(...args) {
          const path = await resolvePath(...args);

          return getUrlFromPath(path);
        }
      },
      breadcrumbs: {
        resolve(...args) {
          return resolvePath(...args);
        }
      }
    }
  }),
  {}
);
