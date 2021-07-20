"use strict";

const { AUTH0_COOKIE_DOMAIN, NODE_ENV } = process.env;

if (!AUTH0_COOKIE_DOMAIN) {
  throw new Error("You have forgotten to set env var ${AUTH0_COOKIE_DOMAIN}");
}

module.exports = {
  // for now the assumption that
  // baseUrlDomain = AUTH0_COOKIE_DOMAIN seems to hold
  baseUrlDomain: AUTH0_COOKIE_DOMAIN,
  isProd: NODE_ENV === "production",
  isSingleMarket: AUTH0_COOKIE_DOMAIN === "localhost"
};
