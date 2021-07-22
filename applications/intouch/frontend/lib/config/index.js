"use strict";

const { FRONTEND_DOMAIN, NODE_ENV } = process.env;

if (!FRONTEND_DOMAIN) {
  throw new Error("You have forgotten to set env var ${FRONTEND_DOMAIN}");
}

module.exports = {
  baseUrlDomain: FRONTEND_DOMAIN,
  isProd: NODE_ENV === "production",
  isSingleMarket: FRONTEND_DOMAIN === "localhost"
};
