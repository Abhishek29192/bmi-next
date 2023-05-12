/* eslint-disable security/detect-non-literal-fs-filename */
"use strict";
/**
 * @typedef { import("gatsby").GatsbyNode } GatsbyNode
 */

const path = require("path");
const { existsSync, writeFileSync, mkdirSync } = require("fs");

const getMetaRedirect = require("./getMetaRedirect");

async function writeRedirectsFile(redirects, folder, pathPrefix) {
  if (!redirects.length) return;

  for (const redirect of redirects) {
    const { fromPath, toPath, isPermanent } = redirect;

    const FILE_PATH = path.join(
      folder,
      fromPath.replace(pathPrefix, ""),
      "index.html"
    );

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileExists = existsSync(FILE_PATH);
    if (!fileExists) {
      try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        mkdirSync(path.dirname(FILE_PATH), { recursive: true });
      } catch (err) {
        // ignore if the directory already exists;
      }

      const data = getMetaRedirect(toPath, isPermanent);
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      writeFileSync(FILE_PATH, data);
    }
  }
}

/**
 * @type {GatasbyNode.onPostBuild}
 */
exports.onPostBuild = ({ store }) => {
  const { redirects, program, config } = store.getState();

  let pathPrefix = "";
  if (program.prefixPaths) {
    pathPrefix = config.pathPrefix;
  }

  const folder = path.join(program.directory, "public");
  return writeRedirectsFile(redirects, folder, pathPrefix);
};
