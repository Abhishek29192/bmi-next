"use strict";

const dontUseCountryCode = process.env.GATSBY_DONT_USE_COUNTRY_CODE === "true";

const getCorrectedPath = (path) => {
  let [correctedPath, query] = (path || "").split("?");

  if (correctedPath.charAt(0) !== "/") {
    correctedPath = `/${correctedPath}`;
  }
  if (correctedPath.charAt(correctedPath.length - 1) !== "/") {
    correctedPath = `${correctedPath}/`;
  }
  if (query) {
    correctedPath = `${correctedPath}?${query}`;
  }
  return correctedPath;
};

const getPathWithCountryCode = (countryCode, path) => {
  const correctedPath = getCorrectedPath(path);
  if (dontUseCountryCode) {
    return correctedPath;
  }
  return `/${countryCode}${correctedPath}`;
};

module.exports = {
  getPathWithCountryCode
};
