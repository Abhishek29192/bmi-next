"use strict";

const { AUTH0_COOKIE_DOMAIN, NODE_ENV } = process.env;

if (!AUTH0_COOKIE_DOMAIN) {
  throw new Error("You have forgotten to set env var ${AUTH0_COOKIE_DOMAIN}");
}

module.exports = {
  baseUrlDomain: AUTH0_COOKIE_DOMAIN,
  isProd: NODE_ENV === "production"
};
