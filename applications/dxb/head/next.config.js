"use strict";

const withTM = require("next-transpile-modules")(["@bmi/gatsby-theme-auth0"]);

const headers = [];

const contentSecurityPolicy = process.env.HEADERS_CSP;
const reportOnly = process.env.HEADERS_CSP_REPORT_ONLY;

if (typeof contentSecurityPolicy !== "undefined") {
  const securityHeaders = [
    {
      key:
        parseInt(reportOnly) === 1
          ? "Content-Security-Policy-Report-Only"
          : "Content-Security-Policy",
      value: contentSecurityPolicy.replace(/\s{2,}/g, " ").trim()
    }
  ];
  headers.push({
    // Apply these headers to all routes in your application.
    source: "/:path*",
    headers: securityHeaders
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    formats: ["image/avif", "image/webp"]
  },
  async headers() {
    return headers;
  },
  async redirects() {
    return [];
  }
};

module.exports = withTM(nextConfig);
