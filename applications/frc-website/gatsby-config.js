"use strict";

const dotenv = require("dotenv");

/**
 * @typedef { import("gatsby").GatsbyConfig } GatsbyConfig
 */

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`
});

/**
 * Note: Both this and package.json are based on @bmi/head,
 * and they should be kept in sync as much as possible in case of any changes to the build process.
 */

/**
 * @type {GatsbyConfig}
 */
const config = {
  siteMetadata: {
    title: `BMI Flat Roof Calculator`,
    description: ``,
    author: `bmi`
  },
  pathPrefix: process.env.GATSBY_FRC_URL_PREFIX,
  plugins: [
    `@bmi/gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        // jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true // defaults to false
      }
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /.svg$/
        }
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
            exportLocalsConvention: "asIs",
            localIdentName: "[name]__[local]--[hash:base64:5]"
          }
        }
      }
    }
  ]
};

module.exports = config;
