"use strict";

const getCredentialData = require("./src/utils/get-credentials-data");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const contentfulCredentialData = getCredentialData(process.env);

module.exports = {
  siteMetadata: {
    title: `BMI dxb`,
    description: ``,
    author: `bmi`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `bmi-starter`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`
      }
    },
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
    ...contentfulCredentialData.map(
      ({ spaceId, accessToken, environment }) => ({
        resolve: `gatsby-source-contentful`,
        options: {
          spaceId,
          accessToken,
          environment
        }
      })
    ),
    `gatsby-plugin-offline`
  ]
};
