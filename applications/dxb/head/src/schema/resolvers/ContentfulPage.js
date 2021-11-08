"use strict";

const { resolvePath, getUrlFromPath } = require("./utils/path");

const pages = [
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
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
      },
      subtitle: {
        async resolve(source, args, context) {
          if (pageName !== "ContentfulSimplePage") {
            return source.subtitle;
          }

          if (!source.subtitle___NODE) {
            return null;
          }

          const longText = await context.nodeModel.getNodeById({
            id: source.subtitle___NODE,
            type: "contentfulSimplePageSubtitleTextNode"
          });

          return longText.subtitle;
        }
      }
    }
  }),
  {}
);
