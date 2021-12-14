"use strict";

const path = require("path");
const { existsSync, writeFileSync, mkdirSync } = require("fs");

const getMetaRedirect = require("./getMetaRedirect");

async function writeRedirectsFile(redirects, folder, pathPrefix) {
  if (!redirects.length) return;

  for (const redirect of redirects) {
    const { fromPath, toPath } = redirect;

    const FILE_PATH = path.join(
      folder,
      fromPath.replace(pathPrefix, ""),
      "index.html"
    );

    const fileExists = existsSync(FILE_PATH);
    if (!fileExists) {
      try {
        mkdirSync(path.dirname(FILE_PATH), { recursive: true });
      } catch (err) {
        // ignore if the directory already exists;
      }

      const data = getMetaRedirect(toPath);
      writeFileSync(FILE_PATH, data);
    }
  }
}

exports.onPostBuild = ({ store }) => {
  const { redirects, program, config } = store.getState();

  let pathPrefix = "";
  if (program.prefixPaths) {
    pathPrefix = config.pathPrefix;
  }

  const folder = path.join(program.directory, "public");
  return writeRedirectsFile(redirects, folder, pathPrefix);
};
