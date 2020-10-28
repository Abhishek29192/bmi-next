"use strict";

require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

/**
 * Note: Both this and package.json are based on @bmi/head,
 * and they should be kept in sync as much as possible in case of any changes to the build process.
 */

module.exports = {
  siteMetadata: {
    title: `BMI Flat Roof Calculator`,
    description: ``,
    author: `bmi`
  },
  pathPrefix: process.env.FRC_URL_PREFIX,
  plugins: [
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
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true
        }
      }
    }
  ]
};
