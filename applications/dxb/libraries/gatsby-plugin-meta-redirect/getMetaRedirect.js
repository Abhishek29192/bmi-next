"use strict";

module.exports = function getMetaRedirect(toPath) {
  let url = toPath.trim();

  const hasProtocol = url.includes("://");
  if (!hasProtocol) {
    const hasLeadingSlash = url.startsWith("/");
    if (!hasLeadingSlash) {
      url = `/${url}`;
    }

    const split = url.split("?");

    const resemblesFile = split[0].includes(".");
    if (!resemblesFile) {
      url = `${split[0]}/${split[1] ? `?${split[1]}` : ""}`.replace(
        /\/\/+/g,
        "/"
      );
    }
  }

  return `<meta http-equiv="refresh" content="0; URL='${url}'" />`;
};
