"use strict";

const withTM = require("next-transpile-modules")(["@bmi-digital/components"]);

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
    deviceSizes: [599, 719, 839, 1439, 2000],
    imageSizes: [
      200, 321, 326, 330, 359, 381, 408, 436, 446, 516, 561, 593, 665, 681, 708,
      713, 785, 916, 920, 988, 1285, 1392
    ],
    loader: "custom"
  },
  async headers() {
    return headers;
  },
  async redirects() {
    return [];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ttf|otf|eot|woff|woff2|svg|png)$/i,
      loader: "file-loader"
    });

    return config;
  }
};

module.exports = withTM(nextConfig);
