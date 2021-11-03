"use strict";

const dontUseCountryCode = process.env.GATSBY_DONT_USE_COUNTRY_CODE === "true";

const getCorrectedPath = (path) => {
  if (!path) {
    return "";
  }
  if (path.charAt(0) !== "/") {
    return `/${path}`;
  }
  return path;
};

const getPathWithCountryCode = (countryCode, path) => {
  const correctedPath = getCorrectedPath(path);
  if (dontUseCountryCode && correctedPath === "") {
    return "/";
  }
  if (dontUseCountryCode) {
    return correctedPath;
  }
  return `/${countryCode}${correctedPath}`;
};

module.exports = {
  getPathWithCountryCode
};
