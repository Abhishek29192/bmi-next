"use strict";

const fs = require("fs");
const toml = require("toml");

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  // Check if the page is a localized 404
  if (page.path.match(/^\/[a-z]{2}\/404\/$/)) {
    const oldPage = { ...page };
    // Get the language code from the path, and match all paths
    // starting with this code (apart from other valid paths)
    const langCode = page.path.split(`/`)[1];
    page.matchPath = `/${langCode}/*`;
    // Recreate the modified page
    deletePage(oldPage);
    createPage(page);
  }
};

// eslint-disable-next-line no-unused-vars
exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions;
  const redirectsTomlFile = `./netlify.toml`;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.existsSync(redirectsTomlFile)) {
    console.log("file exists");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const redirectsToml = fs.readFileSync(redirectsTomlFile);

    const redirects = toml.parse(redirectsToml);
    redirects.redirects.forEach((redirect) =>
      createRedirect({
        fromPath: redirect.from,
        toPath: redirect.to,
        isPermanent: !redirect.status || redirect.status == "301"
      })
    );
  }
};
